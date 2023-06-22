import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, UpdatedAtColumn, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, AutoIncrement, Column, DataType, HasMany, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import { PlatformEntity } from "@/backend/platform/db/entities/platform.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformCategoryEntity),
}))
@Table({ tableName: "platform_categories" })
export class PlatformCategoryEntity extends BaseEntity<PlatformCategoryEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly platformCategoryId: number;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public readonly platformCategoryUuid: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public platformCategoryName: string;

	@IsActiveColumn
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
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
}
