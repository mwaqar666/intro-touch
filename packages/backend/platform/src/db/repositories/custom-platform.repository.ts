import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { CustomPlatformEntity, PlatformCategoryEntity } from "@/backend/platform/db/entities";

export class CustomPlatformRepository extends BaseRepository<CustomPlatformEntity> {
	public constructor() {
		super(CustomPlatformEntity);
	}

	public getCustomPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						as: "customPlatformPlatformCategory",
						model: PlatformCategoryEntity.scope(EntityScopeConst.primaryKeyAndUuidOnly),
						where: { platformCategoryUuid },
					},
				],
			},
		});
	}
}
