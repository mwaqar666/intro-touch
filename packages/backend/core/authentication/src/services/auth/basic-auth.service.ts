import type { UserEntity } from "@/backend/user/db/entities";
import { UserService } from "@/backend/user/services/user";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import { Inject } from "iocc";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import type { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import type { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import type { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import type { VerifyEmailRequestDto } from "@/backend-core/authentication/dto/verify-email";
import { TokenType } from "@/backend-core/authentication/enums";
import { EmailNotVerifiedException } from "@/backend-core/authentication/exceptions";
import type { IAuthProvider } from "@/backend-core/authentication/interface";
import { AuthEmailService, TokenUtilService } from "@/backend-core/authentication/services/utils";
import { VerificationService } from "@/backend-core/authentication/services/verification";

export class BasicAuthService {
	public constructor(
		// Dependencies

		@Inject(UserService) private readonly userService: UserService,
		@Inject(AuthEmailService) private readonly emailUtilService: AuthEmailService,
		@Inject(TokenUtilService) private readonly tokenUtilService: TokenUtilService,
		@Inject(VerificationService) private readonly verificationService: VerificationService,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(AuthenticationTokenConst.AuthProviderToken) private readonly authProvider: IAuthProvider,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async basicLogin({ userEmail, userPassword }: LoginRequestDto): Promise<string> {
		const user: UserEntity = await this.authProvider.retrieveByCredentials<UserEntity>({ userEmail }, { throwOnAbsence: true });

		await user.verifyPassword(userPassword);

		await this.verificationService.validateUserHasNoVerificationTokens(user, TokenType.EmailVerification, EmailNotVerifiedException);

		return this.tokenUtilService.createAuthenticationToken(user);
	}

	public async basicRegister(registerRequestDto: RegisterRequestDto): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async (): Promise<boolean> => {
				const { userNewPassword, userConfirmNewPassword, ...userRegistrationFields }: RegisterRequestDto = registerRequestDto;
				if (userNewPassword !== userConfirmNewPassword) throw new BadRequestException("New password and confirm new password must be same");

				const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");
				const userPictureBucketName: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.ProfilePictures);
				const userPicture: string = userRegistrationFields.userPicture ? await this.storageService.storeFile(userPictureBucketName, userRegistrationFields.userPicture) : "";

				const findOrCreateUserProps: IFindOrCreateUserProps = {
					...userRegistrationFields,
					userPicture,
					userPassword: userNewPassword,
				};

				const user: UserEntity = await this.userService.createNewUserWithProfile(findOrCreateUserProps);

				const verificationToken: VerificationTokenEntity = await this.verificationService.createVerificationToken(user, TokenType.EmailVerification);

				return this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);
			},
		});
	}

	public async verifyUserEmail({ userEmail, tokenIdentifier }: VerifyEmailRequestDto): Promise<string> {
		const user: UserEntity = await this.authProvider.retrieveByCredentials<UserEntity>({ userEmail }, { scopes: [EntityScopeConst.isActive], throwOnAbsence: true });

		await this.verificationService.validateVerificationToken(user, tokenIdentifier, TokenType.EmailVerification);

		return this.tokenUtilService.createAuthenticationToken(user);
	}

	public async resendUserEmailVerificationToken({ userEmail }: ResendRequestDto): Promise<boolean> {
		const user: UserEntity = await this.authProvider.retrieveByCredentials<UserEntity>({ userEmail }, { scopes: [EntityScopeConst.isActive], throwOnAbsence: true });

		const verificationToken: VerificationTokenEntity = await this.verificationService.createVerificationToken(user, TokenType.EmailVerification);

		return this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);
	}
}
