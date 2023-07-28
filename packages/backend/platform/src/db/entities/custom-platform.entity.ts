import { UserProfileEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, BelongsTo, Column, DataType, Scopes, Table } from "sequelize-typescript";
import { PlatformCategoryEntity } from "@/backend/platform/db/entities/platform-category.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => CustomPlatformEntity),
}))
@Table({ tableName: "customPlatforms" })
export class CustomPlatformEntity extends BaseEntity<CustomPlatformEntity> {
	@PrimaryKeyColumn
	public readonly customPlatformId: number;

	@UuidKeyColumn
	public readonly customPlatformUuid: string;

	@ForeignKeyColumn(() => PlatformCategoryEntity)
	public customPlatformPlatformCategoryId: number;

	@ForeignKeyColumn(() => UserProfileEntity)
	public customPlatformUserProfileId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public customPlatformName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public customPlatformIcon: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public customPlatformIdentity: string;

	@IsActiveColumn
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

	@BelongsTo(() => UserProfileEntity, {
		as: "customPlatformUserProfile",
		targetKey: "userProfileId",
		foreignKey: "customPlatformUserProfileId",
	})
	public customPlatformUserProfile: UserProfileEntity;
}
