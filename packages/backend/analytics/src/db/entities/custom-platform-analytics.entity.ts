import { CustomPlatformEntity } from "@/backend/platform/db/entities";
import { CreatedAtColumn, ForeignKeyColumn, PrimaryKeyColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { BelongsTo, Scopes, Table } from "sequelize-typescript";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => CustomPlatformAnalyticsEntity),
}))
@Table({ tableName: "customPlatformAnalytics", timestamps: true, updatedAt: false })
export class CustomPlatformAnalyticsEntity extends BaseEntity<CustomPlatformAnalyticsEntity> {
	@PrimaryKeyColumn
	public customPlatformAnalyticsId: number;

	@UuidKeyColumn
	public customPlatformAnalyticsUuid: string;

	@ForeignKeyColumn(() => CustomPlatformEntity)
	public customPlatformAnalyticsCusPlatId: number;

	@CreatedAtColumn
	public customPlatformAnalyticsCreatedAt: Date;

	@BelongsTo(() => CustomPlatformEntity, {
		as: "customPlatformAnalyticsCusPlat",
		foreignKey: "customPlatformAnalyticsCusPlatId",
		targetKey: "customPlatformId",
	})
	public customPlatformAnalyticsCusPlat: CustomPlatformEntity;
}
