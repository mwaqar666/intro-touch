import { Inject } from "iocc";
import type { PlatformEntity } from "@/backend/platform/db/entities";
import type { PlatformCategoryEntity } from "@/backend/platform/db/entities";
import type { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { PlatformCategoryRepository, PlatformProfileRepository, PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformService {
	public constructor(
		// Dependencies
		@Inject(PlatformProfileRepository) private readonly platformProfileRepository: PlatformProfileRepository,
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
	) {}

	public listPlatformCategories(): Promise<Array<PlatformCategoryEntity>> {
		return this.platformCategoryRepository.findAll({
			findOptions: {},
		});
	}
	public listPlatforms(): Promise<Array<PlatformEntity>> {
		return this.platformRepository.findAll({
			findOptions: {},
		});
	}

	public listPlatformProfiles(): Promise<Array<PlatformProfileEntity>> {
		return this.platformProfileRepository.findAll({
			findOptions: {},
		});
	}
}