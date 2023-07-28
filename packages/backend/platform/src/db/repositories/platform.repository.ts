import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { PlatformCategoryEntity, PlatformEntity } from "@/backend/platform/db/entities";

export class PlatformRepository extends BaseRepository<PlatformEntity> {
	public constructor() {
		super(PlatformEntity);
	}

	public getPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						as: "platformPlatformCategory",
						model: PlatformCategoryEntity.scope(EntityScopeConst.primaryKeyAndUuidOnly),
						where: { platformCategoryUuid },
					},
				],
			},
			scopes: [EntityScopeConst.withoutTimestamps],
		});
	}
}
