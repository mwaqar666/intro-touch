import { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreatedAtColumn, ForeignKeyColumn, PrimaryKeyColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { BelongsTo, Scopes, Table } from "sequelize-typescript";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformAnalyticsEntity),
}))
@Table({ tableName: "platformAnalytics", timestamps: true, updatedAt: false })
export class PlatformAnalyticsEntity extends BaseEntity<PlatformAnalyticsEntity> {
	@PrimaryKeyColumn
	public platformAnalyticsId: number;

	@UuidKeyColumn
	public platformAnalyticsUuid: string;

	@ForeignKeyColumn(() => PlatformProfileEntity)
	public platformAnalyticsPlatformProfileId: number;

	@CreatedAtColumn
	public platformAnalyticsCreatedAt: Date;

	@BelongsTo(() => PlatformProfileEntity, {
		as: "platformAnalyticsPlatformProfile",
		foreignKey: "platformAnalyticsPlatformProfileId",
		targetKey: "platformProfileId",
	})
	public platformAnalyticsPlatformProfile: PlatformProfileEntity;
}
