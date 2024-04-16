import { PlatformAnalyticsEntity } from "@/backend/analytics/db/entities";
import { UserProfileEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, StringColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { BelongsTo, HasMany, Scopes, Table } from "sequelize-typescript";
import { PlatformEntity } from "@/backend/platform/db/entities/platform.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformProfileEntity),
}))
@Table({ tableName: "platformProfiles" })
export class PlatformProfileEntity extends BaseEntity<PlatformProfileEntity> {
	@PrimaryKeyColumn
	public readonly platformProfileId: number;

	@UuidKeyColumn
	public readonly platformProfileUuid: string;

	@ForeignKeyColumn(() => UserProfileEntity)
	public platformProfileProfileId: number;

	@ForeignKeyColumn(() => PlatformEntity)
	public platformProfilePlatformId: number;

	@StringColumn()
	public platformProfileIdentity: string;

	@IsActiveColumn
	public platformProfileIsActive: boolean;

	@CreatedAtColumn
	public platformProfileCreatedAt: Date;

	@UpdatedAtColumn
	public platformProfileUpdatedAt: Date;

	@DeletedAtColumn
	public platformProfileDeletedAt: Nullable<Date>;

	@BelongsTo(() => PlatformEntity, {
		as: "platformProfilePlatform",
		targetKey: "platformId",
		foreignKey: "platformProfilePlatformId",
	})
	public platformProfilePlatform: PlatformEntity;

	@BelongsTo(() => UserProfileEntity, {
		as: "platformProfileProfile",
		targetKey: "userProfileId",
		foreignKey: "platformProfileProfileId",
	})
	public platformProfileProfile: UserProfileEntity;

	@HasMany(() => PlatformAnalyticsEntity, {
		as: "platformProfilePlatformAnalytics",
		foreignKey: "platformAnalyticsPlatformProfileId",
		sourceKey: "platformProfileId",
	})
	public platformProfilePlatformAnalytics: Array<PlatformAnalyticsEntity>;
}
