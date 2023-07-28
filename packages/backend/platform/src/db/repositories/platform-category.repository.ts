import { UserProfileEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { CustomPlatformEntity, PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";

export class PlatformCategoryRepository extends BaseRepository<PlatformCategoryEntity> {
	public constructor() {
		super(PlatformCategoryEntity);
	}

	public getPlatformCategories(): Promise<Array<PlatformCategoryEntity>> {
		return this.findAll({
			findOptions: {},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public getUserOwnedPlatforms(userProfileUuid: string): Promise<Array<PlatformCategoryEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						required: true,
						model: PlatformEntity.scope([EntityScopeConst.withoutTimestamps]),
						as: "platformCategoryPlatforms",
						include: [
							{
								required: true,
								model: PlatformProfileEntity.scope([EntityScopeConst.withoutTimestamps]),
								as: "platformPlatformProfiles",
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
				],
			},
			scopes: [EntityScopeConst.withoutTimestamps],
		});
	}

	public getUserOwnedCustomPlatforms(userProfileUuid: string): Promise<Array<PlatformCategoryEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						required: true,
						model: CustomPlatformEntity.scope([EntityScopeConst.withoutTimestamps]),
						as: "platformCategoryCustomPlatforms",
						include: [
							{
								required: true,
								model: UserProfileEntity.scope([EntityScopeConst.primaryKeyAndUuidOnly]),
								as: "customPlatformUserProfile",
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
