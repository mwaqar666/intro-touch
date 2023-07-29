import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { PlatformCategoryEntity } from "@/backend/platform/db/entities";

export class PlatformCategoryRepository extends BaseRepository<PlatformCategoryEntity> {
	public constructor() {
		super(PlatformCategoryEntity);
	}

	public getPlatformCategories(): Promise<Array<PlatformCategoryEntity>> {
		return this.findAll({
			findOptions: {},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}
}
