import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { UploadedFile } from "@/backend-core/request-processor/dto";
import { S3Bucket } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";
import type { PlatformCategoryEntity, PlatformEntity } from "@/backend/platform/db/entities";
import { PlatformCategoryRepository, PlatformRepository } from "@/backend/platform/db/repositories";
import type { CreateBuiltinPlatformRequestDto } from "@/backend/platform/dto/create-builtin-platform";
import type { UpdateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";

export class PlatformService {
	public constructor(
		// Dependencies

		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public getPlatformList(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.platformRepository.getPlatformList(platformCategoryUuid);
	}

	public getPlatform(platformUuid: string): Promise<PlatformEntity> {
		return this.platformRepository.getPlatform(platformUuid);
	}

	public createBuiltinPlatform(platformCategoryUuid: string, createBuiltinPlatformRequestDto: CreateBuiltinPlatformRequestDto): Promise<PlatformEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<PlatformEntity> => {
				const platformCategory: PlatformCategoryEntity = await this.platformCategoryRepository.getPlatformCategory(platformCategoryUuid);

				const { platformName, platformIcon: platformIconFile }: CreateBuiltinPlatformRequestDto = createBuiltinPlatformRequestDto;

				const platformIcon: string = await this.storageService.storeFile(S3Bucket.BuiltinPlatformIcons, platformIconFile);

				const valuesToCreate: Partial<IEntityTableColumnProperties<PlatformEntity>> = {
					platformName,
					platformIcon,
					platformPlatformCategoryId: platformCategory.platformCategoryId,
				};

				return this.platformRepository.createBuiltinPlatform(valuesToCreate, transaction);
			},
		});
	}

	public updateBuiltinPlatform(platformUuid: string, updateBuiltinPlatformRequestDto: UpdateBuiltinPlatformRequestDto): Promise<PlatformEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<PlatformEntity> => {
				const { platformName, platformIcon: platformIconFile }: UpdateBuiltinPlatformRequestDto = updateBuiltinPlatformRequestDto;

				const platformIcon: Optional<string> = platformIconFile instanceof UploadedFile ? await this.storageService.storeFile(S3Bucket.BuiltinPlatformIcons, platformIconFile) : platformIconFile;

				const valuesToUpdate: Partial<IEntityTableColumnProperties<PlatformEntity>> = {
					platformName,
					platformIcon,
				};

				return this.platformRepository.updateBuiltinPlatform(platformUuid, valuesToUpdate, transaction);
			},
		});
	}

	public deleteBuiltinPlatform(platformUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.platformRepository.deleteBuiltinPlatform(platformUuid, transaction);
			},
		});
	}
}
