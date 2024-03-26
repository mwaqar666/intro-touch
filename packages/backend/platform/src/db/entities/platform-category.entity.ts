import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, PrimaryKeyColumn, StringColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { HasMany, Scopes, Table } from "sequelize-typescript";
import { CustomPlatformEntity } from "@/backend/platform/db/entities/custom-platform.entity";
import { PlatformEntity } from "@/backend/platform/db/entities/platform.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformCategoryEntity),
}))
@Table({ tableName: "platformCategories" })
export class PlatformCategoryEntity extends BaseEntity<PlatformCategoryEntity> {
	@PrimaryKeyColumn
	public readonly platformCategoryId: number;

	@UuidKeyColumn
	public readonly platformCategoryUuid: string;

	@StringColumn({ length: 100 })
	public platformCategoryName: string;

	@IsActiveColumn
	public platformCategoryIsActive: boolean;

	@CreatedAtColumn
	public platformCategoryCreatedAt: Date;

	@UpdatedAtColumn
	public platformCategoryUpdatedAt: Date;

	@DeletedAtColumn
	public platformCategoryDeletedAt: Nullable<Date>;

	@HasMany(() => PlatformEntity, {
		as: "platformCategoryPlatforms",
		sourceKey: "platformCategoryId",
		foreignKey: "platformPlatformCategoryId",
	})
	public platformCategoryPlatforms: Array<PlatformEntity>;

	@HasMany(() => CustomPlatformEntity, {
		as: "platformCategoryCustomPlatforms",
		sourceKey: "platformCategoryId",
		foreignKey: "customPlatformPlatformCategoryId",
	})
	public platformCategoryCustomPlatforms: Array<CustomPlatformEntity>;
}
