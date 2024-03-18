import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver } from "@/backend-core/config/types";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { UploadedFile } from "@/backend-core/request-processor/dto";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import type { CreateUserProfileRequestDto } from "@/backend/user/dto/create-user-profile";
import type { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";

export class UserProfileService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public getAuthUserProfileDropdown(authEntity: UserEntity): Promise<Array<UserProfileEntity>> {
		return this.userProfileRepository.getUserProfileDropdown(authEntity);
	}

	public async getUserProfile(userProfileUuid: string): Promise<UserProfileEntity> {
		return this.userProfileRepository.getUserProfile(userProfileUuid);
	}

	public async createUserProfile(userEntity: UserEntity, createUserProfileRequestDto: CreateUserProfileRequestDto): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				const { userProfilePicture: uploadedPicture, ...userProfileFields }: CreateUserProfileRequestDto = createUserProfileRequestDto;
				const appConfigStage = this.configResolver.resolveConfig("app").env;
				const profilePictureBucket: string = S3BucketConst.BucketName(S3Bucket.ProfilePictures, appConfigStage);
				const userProfilePicture: string = await this.storageService.storeFile(profilePictureBucket, uploadedPicture);

				const userProfileTableColumnProperties: Partial<IEntityTableColumnProperties<UserProfileEntity>> = {
					...userProfileFields,
					userProfilePicture,
					userProfileUserId: userEntity.userId,
				};

				return this.userProfileRepository.createUserProfile(userProfileTableColumnProperties, transaction);
			},
		});
	}

	public async updateUserProfile(userProfileUuid: string, updateUserProfileRequestDto: UpdateUserProfileRequestDto): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				const { userProfilePicture: uploadedPicture, ...userProfileFields }: UpdateUserProfileRequestDto = updateUserProfileRequestDto;

				const appConfigStage = this.configResolver.resolveConfig("app").env;
				const profilePictureBucket: string = S3BucketConst.BucketName(S3Bucket.ProfilePictures, appConfigStage);
				const userProfilePicture: Optional<string> = uploadedPicture instanceof UploadedFile ? await this.storageService.storeFile(profilePictureBucket, uploadedPicture) : uploadedPicture;

				const userProfileTableColumnProperties: Partial<IEntityTableColumnProperties<UserProfileEntity>> = {
					...userProfileFields,
					userProfilePicture,
				};

				return this.userProfileRepository.updateUserProfile(userProfileUuid, userProfileTableColumnProperties, transaction);
			},
		});
	}
}
