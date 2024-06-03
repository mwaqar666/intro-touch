import type { IndustryEntity } from "@/backend/industry/db/entities";
import { IndustryRepository } from "@/backend/industry/db/repositories";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityScope, IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { UploadedFile } from "@/backend-core/request-processor/dto";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import type { Key, Nullable, Optional } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import type { CreateUserProfileRequestDto } from "@/backend/user/dto/create-user-profile";
import type { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";

export class UserProfileService {
	public constructor(
		// Dependencies

		@Inject(IndustryRepository) private readonly industryRepository: IndustryRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public getUserProfileList(authEntity: UserEntity): Promise<Array<UserProfileEntity>> {
		const columnsToInclude: Array<Key<IEntityTableColumnProperties<UserProfileEntity>>> = ["userProfileFirstName", "userProfileLastName", "userProfilePicture", "userProfileEmail", "userProfileIsLive", "userProfileIsActive"];
		const scopes: IEntityScope = [{ method: [EntityScopeConst.withColumns, ...columnsToInclude] }];

		return this.userProfileRepository.getUserProfileList(authEntity, scopes);
	}

	public getUserProfile(userProfileUuid: string): Promise<UserProfileEntity> {
		const industryScopes: IEntityScope = [{ method: [EntityScopeConst.withColumns, "industryName"] }];
		const userProfileScopes: IEntityScope = [EntityScopeConst.withoutTimestamps];

		return this.userProfileRepository.getUserProfile(userProfileUuid, userProfileScopes, industryScopes);
	}

	public createUserProfile(userEntity: UserEntity, createUserProfileRequestDto: CreateUserProfileRequestDto): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				const { userProfilePicture: uploadedPicture, userProfileIndustryUuid, ...userProfileFields }: CreateUserProfileRequestDto = createUserProfileRequestDto;

				const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");
				const profilePictureBucket: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.ProfilePictures);

				const userProfilePicture: string = uploadedPicture ? await this.storageService.storeFile(profilePictureBucket, uploadedPicture) : "";
				const industry: Nullable<IndustryEntity> = await this.getUserProfileAssociatedIndustry(userProfileIndustryUuid);

				const userProfileTableColumnProperties: Partial<IEntityTableColumnProperties<UserProfileEntity>> = {
					...userProfileFields,
					userProfilePicture,
					userProfileUserId: userEntity.userId,
					userProfileIndustryId: industry ? industry.industryId : null,
				};

				const userProfile: UserProfileEntity = await this.userProfileRepository.createUserProfile(userProfileTableColumnProperties, transaction);

				userProfile.setDataValue("userProfileIndustry", industry);

				return userProfile;
			},
		});
	}

	public updateUserProfile(userProfileUuid: string, updateUserProfileRequestDto: UpdateUserProfileRequestDto): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				const { userProfilePicture: uploadedPicture, userProfileIndustryUuid, ...userProfileFields }: UpdateUserProfileRequestDto = updateUserProfileRequestDto;

				const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");
				const profilePictureBucket: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.ProfilePictures);

				const userProfilePicture: Optional<string> = uploadedPicture instanceof UploadedFile ? await this.storageService.storeFile(profilePictureBucket, uploadedPicture) : uploadedPicture;
				const industry: Nullable<IndustryEntity> = await this.getUserProfileAssociatedIndustry(userProfileIndustryUuid);

				const userProfileTableColumnProperties: Partial<IEntityTableColumnProperties<UserProfileEntity>> = {
					...userProfileFields,
					userProfilePicture,
					userProfileIndustryId: industry ? industry.industryId : null,
				};

				const userProfile: UserProfileEntity = await this.userProfileRepository.updateUserProfile(userProfileUuid, userProfileTableColumnProperties, transaction);

				userProfile.userProfileIndustry = industry;

				return userProfile;
			},
		});
	}

	public changeLiveProfile(userEntity: UserEntity, userProfileUuid: string): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				return this.userProfileRepository.changeLiveProfile(userEntity, userProfileUuid, transaction);
			},
		});
	}

	public deleteUserProfile(userProfileUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.userProfileRepository.deleteUserProfile(userProfileUuid, transaction);
			},
		});
	}

	private async getUserProfileAssociatedIndustry(industryUuid: Optional<string>): Promise<Nullable<IndustryEntity>> {
		if (!industryUuid) return null;

		const industryScopes: IEntityScope = [{ method: [EntityScopeConst.withColumns, "industryName"] }];

		return this.industryRepository.getIndustryOrNull(industryUuid, industryScopes);
	}
}
