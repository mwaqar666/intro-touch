import { UserProfileEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";

export class PlatformRepository extends BaseRepository<PlatformEntity> {
	public constructor() {
		super(PlatformEntity);
	}

	public getPlatformList(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
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
			scopes: [EntityScopeConst.withoutTimestamps],
		});
	}

	public getPlatform(platformUuid: string): Promise<PlatformEntity> {
		return this.resolveOneOrFail(platformUuid, [EntityScopeConst.withoutTimestamps]);
	}

	public createBuiltinPlatform(valuesToCreate: Partial<IEntityTableColumnProperties<PlatformEntity>>, transaction: Transaction): Promise<PlatformEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}

	public updateBuiltinPlatform(platformUuid: string, valuesToUpdate: Partial<IEntityTableColumnProperties<PlatformEntity>>, transaction: Transaction): Promise<PlatformEntity> {
		return this.updateOne({
			valuesToUpdate,
			entity: platformUuid,
			transaction,
		});
	}

	public deleteBuiltinPlatform(platformUuid: string, transaction: Transaction): Promise<boolean> {
		return this.deleteOne({
			entity: platformUuid,
			transaction,
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
						model: PlatformProfileEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps]),
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
