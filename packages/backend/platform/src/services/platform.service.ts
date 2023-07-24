import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformCategoryEntity, PlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository, PlatformCategoryRepository, PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformService {
	public constructor(
		// Dependencies

		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
	) {}

	public getPlatformCategories(): Promise<Array<PlatformCategoryEntity>> {
		return this.platformCategoryRepository.getPlatformCategories();
	}

	public getPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.platformRepository.getPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public getCustomPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.customPlatformRepository.getCustomPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public async getUserOwnedPlatforms(userProfileUuid: string): Promise<Array<PlatformCategoryEntity>> {
		return this.platformCategoryRepository.getUserOwnedPlatforms(userProfileUuid);
	}
}
