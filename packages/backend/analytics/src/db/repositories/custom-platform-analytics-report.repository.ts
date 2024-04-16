import { CustomPlatformEntity } from "@/backend/platform/db/entities";
import type { UserProfileEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Nullable } from "@/stacks/types";
import type { Includeable } from "sequelize";
import { Op } from "sequelize";
import { CustomPlatformAnalyticsEntity } from "@/backend/analytics/db/entities";

export class CustomPlatformAnalyticsReportRepository extends BaseRepository<CustomPlatformEntity> {
	public constructor() {
		super(CustomPlatformEntity);
	}

	public getPlatformAnalyticsVisitCount(userProfile: UserProfileEntity, durationBoundary: Nullable<[Date, Date]>): Promise<Array<CustomPlatformEntity>> {
		const analyticsTableInclusion: Includeable = {
			required: false,
			as: "customPlatformCustomPlatformAnalytics",
			model: CustomPlatformAnalyticsEntity.applyScopes([EntityScopeConst.withoutTimestamps]),
		};

		if (durationBoundary) {
			analyticsTableInclusion.where = {
				customPlatformAnalyticsCreatedAt: { [Op.between]: durationBoundary },
			};
		}

		return this.findAll({
			scopes: [EntityScopeConst.withoutTimestamps],
			findOptions: {
				where: { customPlatformUserProfileId: userProfile.userProfileId },
				include: [analyticsTableInclusion],
			},
		});
	}
}
