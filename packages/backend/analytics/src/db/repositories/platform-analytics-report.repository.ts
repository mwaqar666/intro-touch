import { PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import type { UserProfileEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Nullable } from "@/stacks/types";
import type { Includeable } from "sequelize";
import { Op } from "sequelize";
import { PlatformAnalyticsEntity } from "@/backend/analytics/db/entities";

export class PlatformAnalyticsReportRepository extends BaseRepository<PlatformProfileEntity> {
	public constructor() {
		super(PlatformProfileEntity);
	}

	public getPlatformVisitCount(userProfile: UserProfileEntity, durationBoundary: Nullable<[Date, Date]>): Promise<Array<PlatformProfileEntity>> {
		const analyticsTableInclusion: Includeable = {
			required: false,
			as: "platformProfilePlatformAnalytics",
			model: PlatformAnalyticsEntity.applyScopes([EntityScopeConst.withoutTimestamps]),
		};

		if (durationBoundary) {
			analyticsTableInclusion.where = {
				platformAnalyticsCreatedAt: { [Op.between]: durationBoundary },
			};
		}

		const platformTableInclusion: Includeable = {
			required: true,
			as: "platformProfilePlatform",
			model: PlatformEntity.applyScopes([EntityScopeConst.withoutTimestamps]),
		};

		return this.findAll({
			scopes: [EntityScopeConst.withoutTimestamps],
			findOptions: {
				where: { platformProfileProfileId: userProfile.userProfileId },
				include: [platformTableInclusion, analyticsTableInclusion],
			},
		});
	}
}
