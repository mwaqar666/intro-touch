import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, BelongsTo, Column, DataType, HasMany, HasOne, Scopes, Table } from "sequelize-typescript";
import { PlatformCategoryEntity } from "@/backend/platform/db/entities/platform-category.entity";
import { PlatformProfileEntity } from "@/backend/platform/db/entities/platform-profile.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformEntity),
}))
@Table({ tableName: "platforms" })
export class PlatformEntity extends BaseEntity<PlatformEntity> {
	@PrimaryKeyColumn
	public readonly platformId: number;

	@UuidKeyColumn
	public readonly platformUuid: string;

	@ForeignKeyColumn(() => PlatformCategoryEntity)
	public platformPlatformCategoryId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public platformName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public platformIcon: string;

	@IsActiveColumn
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
	@HasOne(() => PlatformProfileEntity, {
		as: "platformPlatformProfile",
		sourceKey: "platformId",
		foreignKey: "platformProfilePlatformId",
	})
	public platformPlatformProfile: PlatformProfileEntity;
	public platformPlatformProfiles: Array<PlatformProfileEntity>;
}
