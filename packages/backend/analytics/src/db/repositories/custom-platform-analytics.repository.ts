import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { CustomPlatformAnalyticsEntity } from "@/backend/analytics/db/entities";

export class CustomPlatformAnalyticsRepository extends BaseRepository<CustomPlatformAnalyticsEntity> {
	public constructor() {
		super(CustomPlatformAnalyticsEntity);
	}

	public createCustomPlatformAnalytics(valuesToCreate: Partial<IEntityTableColumnProperties<CustomPlatformAnalyticsEntity>>, transaction: Transaction): Promise<CustomPlatformAnalyticsEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}
}
