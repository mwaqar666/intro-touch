import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, UpdatedAtColumn, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import { PlatformCategoryEntity } from "@/backend/platform/db/entities/platform-category.entity";
import { PlatformProfileEntity } from "@/backend/platform/db/entities/platform-profile.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformEntity),
}))
@Table({ tableName: "platforms" })
export class PlatformEntity extends BaseEntity<PlatformEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly platformId: number;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public readonly platformUuid: string;

	@ForeignKey(() => PlatformCategoryEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public platformPlatformCategoryId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public platformName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public platformIcon: string;

	@IsActiveColumn
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public platformIsActive: boolean;

	@CreatedAtColumn
	public platformCreatedAt: Date;

	@UpdatedAtColumn
	public platformUpdatedAt: Date;

	@DeletedAtColumn
	public platformDeletedAt: Nullable<Date>;

	@BelongsTo(() => PlatformCategoryEntity, {
		as: "platformPlatformCategory",
		targetKey: "platformCategoryId",
		foreignKey: "platformPlatformCategoryId",
	})
	public platformPlatformCategory: PlatformCategoryEntity;

	@HasMany(() => PlatformProfileEntity, {
		as: "platformPlatformProfiles",
		sourceKey: "platformId",
		foreignKey: "platformProfilePlatformId",
	})
	public platformPlatformProfiles: Array<PlatformProfileEntity>;
}
