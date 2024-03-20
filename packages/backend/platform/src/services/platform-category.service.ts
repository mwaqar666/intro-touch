import { Inject } from "iocc";
import type { PlatformCategoryEntity } from "@/backend/platform/db/entities";
import { PlatformCategoryRepository } from "@/backend/platform/db/repositories";

export class PlatformCategoryService {
	public constructor(
		// Dependencies

		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
	) {}

	public getPlatformCategories(): Promise<Array<PlatformCategoryEntity>> {
		return this.platformCategoryRepository.getPlatformCategories();
	}

	public async fetchPlatformCategory(platformCategoryUuid: string): Promise<PlatformCategoryEntity> {
		return this.platformCategoryRepository.fetchPlatformCategory(platformCategoryUuid);
	}
}
