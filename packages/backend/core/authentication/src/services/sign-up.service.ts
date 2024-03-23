import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import { Inject } from "iocc";
import type { RegisterRequestDto } from "@/backend-core/authentication/dto/register";

export class SignUpService {
	public constructor(
		// Dependencies
		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		// @Inject(EmailUtilService) private readonly emailUtilService: EmailUtilService,
		// @Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async basicRegister(registerRequestDto: RegisterRequestDto): Promise<boolean> {
		const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");

		const userPictureBucketName: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.ProfilePictures);

		const findOrCreateUserProps: IFindOrCreateUserProps = {
			...registerRequestDto,
			userPicture: await this.storageService.storeFile(userPictureBucketName, registerRequestDto.userPicture),
			userParentId: 1,
		};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const user: UserEntity = await this.userAuthService.createNewUserWithProfile(findOrCreateUserProps);

		// const verificationToken: VerificationTokenEntity = await this.verificationTokenService.createEmailVerificationToken(user);
		//
		// await this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);

		return true;
	}
}
