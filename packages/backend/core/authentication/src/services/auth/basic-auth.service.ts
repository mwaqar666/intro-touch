import type { UserEntity } from "@/backend/user/db/entities";
import { UserService } from "@/backend/user/services";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import { Inject } from "iocc";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import type { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import type { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import { EmailNotVerifiedException } from "@/backend-core/authentication/exceptions";
import type { IAuthProvider } from "@/backend-core/authentication/interface";
import { VerificationService } from "@/backend-core/authentication/services/verification";
import { EmailUtilService, TokenUtilService } from "@/backend-core/authentication/utils";

export class BasicAuthService {
	public constructor(
		// Dependencies

		@Inject(UserService) private readonly userService: UserService,
		@Inject(TokenUtilService) private readonly tokenUtilService: TokenUtilService,
		@Inject(EmailUtilService) private readonly emailUtilService: EmailUtilService,
		@Inject(VerificationService) private readonly verificationService: VerificationService,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(AuthenticationTokenConst.AuthProviderToken) private readonly authProvider: IAuthProvider,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async basicLogin({ userEmail, userPassword }: LoginRequestDto): Promise<string> {
		const user: UserEntity = await this.authProvider.retrieveByCredentials<UserEntity>({ userEmail, userPassword }, { throwOnAbsence: true });

		const userIsVerified: boolean = await this.verificationService.verifyUserEmailIsVerified(user);
		if (!userIsVerified) throw new EmailNotVerifiedException();

		return this.tokenUtilService.createAuthenticationToken(user);
	}

	public async basicRegister(registerRequestDto: RegisterRequestDto): Promise<boolean> {
		const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");

		const userPictureBucketName: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.ProfilePictures);
		const userPicture: string = registerRequestDto.userPicture ? await this.storageService.storeFile(userPictureBucketName, registerRequestDto.userPicture) : "";

		const findOrCreateUserProps: IFindOrCreateUserProps = {
			...registerRequestDto,
			userParentId: 1,
			userPicture,
		};

		const user: UserEntity = await this.userService.createNewUserWithProfile(findOrCreateUserProps);

		const verificationToken: VerificationTokenEntity = await this.verificationService.createEmailVerificationToken(user);

		await this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);

		return true;
	}
}
