import { UserProfileEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";

export class PlatformRepository extends BaseRepository<PlatformEntity> {
	public constructor() {
		super(PlatformEntity);
	}

	public fetchPlatform(platformUuid: string): Promise<PlatformEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: {
					platformUuid,
				},
			},
		});
	}

	public getPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						required: true,
						as: "platformPlatformCategory",
						model: PlatformCategoryEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutSelection]),
						where: { platformCategoryUuid },
					},
				],
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}

	public getUserOwnedPlatforms(userProfileUuid: string, platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						required: true,
						as: "platformPlatformCategory",
						model: PlatformCategoryEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutSelection]),
						where: { platformCategoryUuid },
					},
					{
						required: true,
						model: PlatformProfileEntity.scope([EntityScopeConst.withoutTimestamps]),
						as: "platformPlatformProfiles",
						include: [
							{
								required: true,
								model: UserProfileEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutSelection]),
								as: "platformProfileProfile",
								where: { userProfileUuid },
							},
						],
					},
				],
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}
}
