import type { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { PlatformProfileRepository } from "@/backend/platform/db/repositories";
import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { previousMonday, startOfMonth, startOfToday } from "date-fns";
import { Inject } from "iocc";
import type { PlatformAnalyticsEntity } from "@/backend/analytics/db/entities";
import { PlatformAnalyticsReportRepository, PlatformAnalyticsRepository } from "@/backend/analytics/db/repositories";
import type { ProfileAnalyticsRequestPathDto, ProfileAnalyticsRequestQueryDto } from "@/backend/analytics/dto/profile-analytics";
import type { TAnalyticsDuration } from "@/backend/analytics/types";

export class PlatformAnalyticsService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(PlatformProfileRepository) private readonly platformProfileRepository: PlatformProfileRepository,
		@Inject(PlatformAnalyticsRepository) private readonly platformAnalyticsRepository: PlatformAnalyticsRepository,
		@Inject(PlatformAnalyticsReportRepository) private readonly platformAnalyticsReportRepository: PlatformAnalyticsReportRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public createPlatformProfileVisit(platformProfileUuid: string): Promise<PlatformAnalyticsEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<PlatformAnalyticsEntity> => {
				const platformProfile: PlatformProfileEntity = await this.platformProfileRepository.resolveOneOrFail(platformProfileUuid, [EntityScopeConst.primaryKeyOnly]);

				const valuesToCreate: Partial<IEntityTableColumnProperties<PlatformAnalyticsEntity>> = {
					platformAnalyticsPlatformProfileId: platformProfile.platformProfileId,
				};

				return this.platformAnalyticsRepository.createPlatformAnalytics(valuesToCreate, transaction);
			},
		});
	}

	public async getUserProfilePlatformVisits(analyticsRequestPathDto: ProfileAnalyticsRequestPathDto, analyticsRequestQueryDto: ProfileAnalyticsRequestQueryDto): Promise<Array<PlatformProfileEntity>> {
		const userProfile: UserProfileEntity = await this.userProfileRepository.resolveOneOrFail(analyticsRequestPathDto.userProfileUuid, [EntityScopeConst.primaryKeyOnly]);

		const durationBoundary: Nullable<[Date, Date]> = analyticsRequestQueryDto.duration ? this.getDurationBoundary(analyticsRequestQueryDto.duration) : null;

		return this.platformAnalyticsReportRepository.getPlatformVisitCount(userProfile, durationBoundary);
	}

	private getDurationBoundary(duration: TAnalyticsDuration): [Date, Date] {
		const currentDate: Date = new Date();

		switch (duration) {
			case "today":
				return [startOfToday(), currentDate];

			case "lastWeek":
				return [previousMonday(currentDate), currentDate];

			case "lastMonth":
				return [startOfMonth(currentDate), currentDate];
		}
	}
}
