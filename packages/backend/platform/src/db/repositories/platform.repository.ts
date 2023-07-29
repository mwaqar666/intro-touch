import { UserProfileEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";

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

	public getUserOwnedPlatforms(userProfileUuid: string, platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						as: "platformPlatformCategory",
						model: PlatformCategoryEntity.scope(EntityScopeConst.primaryKeyAndUuidOnly),
						where: { platformCategoryUuid },
					},
					{
						required: true,
						model: PlatformProfileEntity.scope([EntityScopeConst.withoutTimestamps]),
						as: "platformPlatformProfile",
						include: [
							{
								required: true,
								model: UserProfileEntity.scope([EntityScopeConst.primaryKeyAndUuidOnly]),
								as: "platformProfileProfile",
								where: { userProfileUuid },
							},
						],
					},
				],
			},
			scopes: [EntityScopeConst.withoutTimestamps],
		});
	}
}
