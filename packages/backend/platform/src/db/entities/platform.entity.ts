import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, StringColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { BelongsTo, HasMany, Scopes, Table } from "sequelize-typescript";
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

	@StringColumn({ length: 100 })
	public platformName: string;

	@StringColumn()
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
	public platformPlatformProfiles: Array<PlatformProfileEntity>;
}
