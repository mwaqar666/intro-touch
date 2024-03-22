import { UserProfileEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { CustomPlatformEntity, PlatformCategoryEntity } from "@/backend/platform/db/entities";

export class CustomPlatformRepository extends BaseRepository<CustomPlatformEntity> {
	public constructor() {
		super(CustomPlatformEntity);
	}

	public getCustomPlatformList(userProfileUuid: string, platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						required: true,
						as: "customPlatformUserProfile",
						model: UserProfileEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutSelection]),
						where: { userProfileUuid },
					},
					{
						required: true,
						as: "customPlatformPlatformCategory",
						model: PlatformCategoryEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutSelection]),
						where: { platformCategoryUuid },
					},
				],
			},
			scopes: [EntityScopeConst.withoutTimestamps],
		});
	}

	public getCustomPlatform(customPlatformUuid: string): Promise<CustomPlatformEntity> {
		return this.resolveOneOrFail(customPlatformUuid, [EntityScopeConst.withoutTimestamps]);
	}

	public async createCustomPlatform(valuesToCreate: Partial<IEntityTableColumnProperties<CustomPlatformEntity>>, transaction: Transaction): Promise<CustomPlatformEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}

	public updateCustomPlatform(customPlatformUuid: string, valuesToUpdate: Partial<IEntityTableColumnProperties<CustomPlatformEntity>>, transaction: Transaction): Promise<CustomPlatformEntity> {
		return this.updateOne({
			entity: customPlatformUuid,
			valuesToUpdate,
			transaction,
		});
	}

	public deleteCustomPlatform(customPlatformUuid: string, transaction: Transaction): Promise<boolean> {
		return this.deleteOne({
			entity: customPlatformUuid,
			transaction,
		});
	}

	public getUserOwnedCustomPlatforms(userProfileUuid: string, platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.findAll({
			findOptions: {
				include: [
					{
						required: true,
						as: "customPlatformPlatformCategory",
						model: PlatformCategoryEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutSelection]),
						where: { platformCategoryUuid },
					},
					{
						required: true,
						model: UserProfileEntity.scope([EntityScopeConst.isActive, EntityScopeConst.withoutSelection]),
						as: "customPlatformUserProfile",
						where: { userProfileUuid },
					},
				],
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}
}
