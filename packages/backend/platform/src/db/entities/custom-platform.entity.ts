import { CustomPlatformAnalyticsEntity } from "@/backend/analytics/db/entities";
import { UserProfileEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, StringColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { BelongsTo, HasMany, Scopes, Table } from "sequelize-typescript";
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

	@StringColumn({ length: 100 })
	public customPlatformName: string;

	@StringColumn()
	public customPlatformIcon: string;

	@StringColumn()
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

	@HasMany(() => CustomPlatformAnalyticsEntity, {
		as: "customPlatformCustomPlatformAnalytics",
		foreignKey: "customPlatformAnalyticsCusPlatId",
		sourceKey: "customPlatformId",
	})
	public customPlatformCustomPlatformAnalytics: Array<CustomPlatformAnalyticsEntity>;
}
