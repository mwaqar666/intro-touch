import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { PlatformAnalyticsEntity } from "@/backend/analytics/db/entities";

export class PlatformAnalyticsRepository extends BaseRepository<PlatformAnalyticsEntity> {
	public constructor() {
		super(PlatformAnalyticsEntity);
	}

	public createPlatformAnalytics(valuesToCreate: Partial<IEntityTableColumnProperties<PlatformAnalyticsEntity>>, transaction: Transaction): Promise<PlatformAnalyticsEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}
}
