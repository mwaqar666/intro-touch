import { EntityScopeConst } from "@/backend-core/database/const";
import { Inject } from "iocc";
import type { PlatformCategoryEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
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
			scopes: [EntityScopeConst.isActive],
		});
	}

	public async listPlatforms(platformCategoryUuid: string) {
		const platformCategories = await this.platformCategoryRepository.findOneOrFail({
			findOptions: { where: { platformCategoryUuid } },
		});
		const platformCategoryId = platformCategories.platformCategoryId;

		// console.log(platformCategories.platformCategoryId);
		return this.platformRepository.findAll({
			findOptions: {
				where: { platformPlatformCategoryId: platformCategoryId },
			},
		});
	}

	public listPlatformProfiles(): Promise<Array<PlatformProfileEntity>> {
		return this.platformProfileRepository.findAll({
			findOptions: {},
		});
	}
}
