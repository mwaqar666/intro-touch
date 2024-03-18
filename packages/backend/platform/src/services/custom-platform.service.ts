import { UserProfileService } from "@/backend/user/services";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { CustomPlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository } from "@/backend/platform/db/repositories";
import type { CreateCustomPlatformRequestDto } from "@/backend/platform/dto/create-custom-platform";
import type { UpdateCustomPlatformRequestDto } from "@/backend/platform/dto/update-custom-platform";
import { PlatformCategoryService } from "@/backend/platform/services/platform-category.service";

export class CustomPlatformService {
	public constructor(
		// Dependencies

		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(UserProfileService) private readonly userProfileService: UserProfileService,
		@Inject(PlatformCategoryService) private readonly platformCategoryService: PlatformCategoryService,
	) {}

	public getCustomPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.customPlatformRepository.getCustomPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public async updateCustomPlatform(customPlatformUuid: string, updateCustomPlatformRequestDto: UpdateCustomPlatformRequestDto): Promise<CustomPlatformEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<CustomPlatformEntity> => {
				return this.customPlatformRepository.updateCustomPlatform(customPlatformUuid, updateCustomPlatformRequestDto, transaction);
			},
		});
	}

	public async createCustomPlatform(userProfileUuid: string, platformCategoryUuid: string, createCustomPlatformRequestDto: CreateCustomPlatformRequestDto): Promise<CustomPlatformEntity> {
		const userProfileId: number = (await this.userProfileService.getUserProfile(userProfileUuid)).userProfileId;
		const platformCategoryId: number = (await this.platformCategoryService.fetchPlatformCategory(platformCategoryUuid)).platformCategoryId;

		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<CustomPlatformEntity> => {
				return await this.customPlatformRepository.createCustomPlatform(userProfileId, platformCategoryId, createCustomPlatformRequestDto, transaction);
			},
		});
	}

	public async deleteCustomPlatform(customPlatformUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<CustomPlatformEntity> => {
				return this.customPlatformRepository.deleteCustomPlatform(customPlatformUuid, transaction);
			},
		});
	}
}
