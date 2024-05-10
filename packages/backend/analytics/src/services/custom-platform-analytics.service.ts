import type { CustomPlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository } from "@/backend/platform/db/repositories";
import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { previousMonday, startOfMonth, startOfToday } from "date-fns";
import { Inject } from "iocc";
import type { CustomPlatformAnalyticsEntity } from "@/backend/analytics/db/entities";
import { CustomPlatformAnalyticsReportRepository, CustomPlatformAnalyticsRepository } from "@/backend/analytics/db/repositories";
import type { ProfileAnalyticsRequestPathDto, ProfileAnalyticsRequestQueryDto } from "@/backend/analytics/dto/profile-analytics";
import type { TAnalyticsDuration } from "@/backend/analytics/types";

export class CustomPlatformAnalyticsService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(CustomPlatformAnalyticsRepository) private readonly customPlatformAnalyticsRepository: CustomPlatformAnalyticsRepository,
		@Inject(CustomPlatformAnalyticsReportRepository) private readonly customPlatformAnalyticsReportRepository: CustomPlatformAnalyticsReportRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public createCustomPlatformProfileVisit(customPlatformUuid: string): Promise<CustomPlatformAnalyticsEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<CustomPlatformAnalyticsEntity> => {
				const customPlatform: CustomPlatformEntity = await this.customPlatformRepository.resolveOneOrFail(customPlatformUuid, [EntityScopeConst.primaryKeyOnly]);

				const valuesToCreate: Partial<IEntityTableColumnProperties<CustomPlatformAnalyticsEntity>> = {
					customPlatformAnalyticsCusPlatId: customPlatform.customPlatformId,
				};

				return this.customPlatformAnalyticsRepository.createCustomPlatformAnalytics(valuesToCreate, transaction);
			},
		});
	}

	public async getUserProfileCustomPlatformVisits(analyticsRequestPathDto: ProfileAnalyticsRequestPathDto, analyticsRequestQueryDto: ProfileAnalyticsRequestQueryDto): Promise<Array<CustomPlatformEntity>> {
		const userProfile: UserProfileEntity = await this.userProfileRepository.resolveOneOrFail(analyticsRequestPathDto.userProfileUuid, [EntityScopeConst.primaryKeyOnly]);

		const durationBoundary: Nullable<[Date, Date]> = analyticsRequestQueryDto.duration ? this.getDurationBoundary(analyticsRequestQueryDto.duration) : null;

		return this.customPlatformAnalyticsReportRepository.getPlatformAnalyticsVisitCount(userProfile, durationBoundary);
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
