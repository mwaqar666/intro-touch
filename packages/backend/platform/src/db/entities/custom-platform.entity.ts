import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, UpdatedAtColumn, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import { PlatformCategoryEntity } from "@/backend/platform/db/entities/platform-category.entity";
import { PlatformProfileEntity } from "@/backend/platform/db/entities/platform-profile.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => CustomPlatformEntity),
}))
@Table({ tableName: "custom_platforms" })
export class CustomPlatformEntity extends BaseEntity<CustomPlatformEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly customPlatformId: number;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public readonly customPlatformUuid: string;

	@ForeignKey(() => PlatformCategoryEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public customPlatformPlatformCategoryId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public customPlatformName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public customPlatformIcon: string;

	@IsActiveColumn
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public customPlatformIsActive: boolean;

	@CreatedAtColumn
	public customPlatformCreatedAt: Date;

	@UpdatedAtColumn
	public customPlatformUpdatedAt: Date;

	@DeletedAtColumn
	public customPlatformDeletedAt: Nullable<Date>;

	@BelongsTo(() => PlatformCategoryEntity, {
		as: "customPlatformPlatformCategory",
		targetKey: "platformCategoryId",
		foreignKey: "customPlatformPlatformCategoryId",
	})
	public customPlatformPlatformCategory: PlatformCategoryEntity;

	@HasMany(() => PlatformProfileEntity, {
		as: "customPlatformPlatformProfiles",
		sourceKey: "customPlatformId",
		foreignKey: "platformProfileCustomPlatformId",
	})
	public customPlatformPlatformProfiles: Array<PlatformProfileEntity>;
}
