import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { UploadedFile } from "@/backend-core/request-processor/dto";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformCategoryEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository, PlatformCategoryRepository } from "@/backend/platform/db/repositories";
import type { CreateCustomPlatformRequestBodyDto, CreateCustomPlatformRequestPathDto } from "@/backend/platform/dto/create-custom-platform";
import type { ListCustomPlatformRequestDto } from "@/backend/platform/dto/list-custom-platform";
import type { UpdateCustomPlatformRequestDto } from "@/backend/platform/dto/update-custom-platform";

export class CustomPlatformService {
	public constructor(
		// Dependencies

		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public getCustomPlatformList({ userProfileUuid, platformCategoryUuid }: ListCustomPlatformRequestDto): Promise<Array<CustomPlatformEntity>> {
		return this.customPlatformRepository.getCustomPlatformList(userProfileUuid, platformCategoryUuid);
	}

	public getCustomPlatform(customPlatformUuid: string): Promise<CustomPlatformEntity> {
		return this.customPlatformRepository.getCustomPlatform(customPlatformUuid);
	}

	public createCustomPlatform({ userProfileUuid, platformCategoryUuid }: CreateCustomPlatformRequestPathDto, createCustomPlatformRequestBodyDto: CreateCustomPlatformRequestBodyDto): Promise<CustomPlatformEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<CustomPlatformEntity> => {
				const userProfile: UserProfileEntity = await this.userProfileRepository.getUserProfile(userProfileUuid);
				const platformCategory: PlatformCategoryEntity = await this.platformCategoryRepository.getPlatformCategory(platformCategoryUuid);

				const { customPlatformIcon: customPlatformIconFile, ...customPlatformValues }: CreateCustomPlatformRequestBodyDto = createCustomPlatformRequestBodyDto;

				const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");
				const customPlatformIconBucketName: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.CustomPlatformIcons);

				const customPlatformIcon: string = await this.storageService.storeFile(customPlatformIconBucketName, customPlatformIconFile);

				const valuesToCreate: Partial<IEntityTableColumnProperties<CustomPlatformEntity>> = {
					...customPlatformValues,
					customPlatformIcon,
					customPlatformUserProfileId: userProfile.userProfileId,
					customPlatformPlatformCategoryId: platformCategory.platformCategoryId,
				};

				return await this.customPlatformRepository.createCustomPlatform(valuesToCreate, transaction);
			},
		});
	}

	public updateCustomPlatform(customPlatformUuid: string, updateCustomPlatformRequestDto: UpdateCustomPlatformRequestDto): Promise<CustomPlatformEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<CustomPlatformEntity> => {
				const { customPlatformIcon: customPlatformIconFile, ...customPlatformValues }: UpdateCustomPlatformRequestDto = updateCustomPlatformRequestDto;

				const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");
				const customPlatformIconBucketName: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.CustomPlatformIcons);

				const customPlatformIcon: Optional<string> = customPlatformIconFile instanceof UploadedFile ? await this.storageService.storeFile(customPlatformIconBucketName, customPlatformIconFile) : customPlatformIconFile;

				const valuesToUpdate: Partial<IEntityTableColumnProperties<CustomPlatformEntity>> = {
					...customPlatformValues,
					customPlatformIcon,
				};

				return this.customPlatformRepository.updateCustomPlatform(customPlatformUuid, valuesToUpdate, transaction);
			},
		});
	}

	public async deleteCustomPlatform(customPlatformUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.customPlatformRepository.deleteCustomPlatform(customPlatformUuid, transaction);
			},
		});
	}
}
