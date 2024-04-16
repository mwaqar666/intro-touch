import { Controller, Path, Query } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { CustomPlatformAnalyticsEntity, PlatformAnalyticsEntity } from "@/backend/analytics/db/entities";
import type { ProfileAnalyticsResponseDto } from "@/backend/analytics/dto/profile-analytics";
import { ProfileAnalyticsRequestPathDto, ProfileAnalyticsRequestQueryDto } from "@/backend/analytics/dto/profile-analytics";
import { CustomPlatformAnalyticsService, PlatformAnalyticsService } from "@/backend/analytics/services";

@Controller
export class AnalyticsController {
	public constructor(
		// Dependencies

		@Inject(PlatformAnalyticsService) private readonly platformAnalyticsService: PlatformAnalyticsService,
		@Inject(CustomPlatformAnalyticsService) private readonly customPlatformAnalyticsService: CustomPlatformAnalyticsService,
	) {}

	public async getUserProfileAnalytics(
		@Path(ProfileAnalyticsRequestPathDto) requestPathDto: ProfileAnalyticsRequestPathDto,
		@Query(ProfileAnalyticsRequestQueryDto) requestQueryDto: ProfileAnalyticsRequestQueryDto,
	): Promise<ProfileAnalyticsResponseDto> {
		return {
			platformVisits: await this.platformAnalyticsService.getUserProfilePlatformVisits(requestPathDto, requestQueryDto),
			customPlatformVisits: await this.customPlatformAnalyticsService.getUserProfileCustomPlatformVisits(requestPathDto, requestQueryDto),
		};
	}

	public async createPlatformProfileVisit(@Path("platformProfileUuid") platformProfileUuid: string): Promise<{ platformAnalytics: PlatformAnalyticsEntity }> {
		return { platformAnalytics: await this.platformAnalyticsService.createPlatformProfileVisit(platformProfileUuid) };
	}

	public async createCustomPlatformProfileVisit(@Path("customPlatformUuid") customPlatformUuid: string): Promise<{ customPlatformAnalytics: CustomPlatformAnalyticsEntity }> {
		return { customPlatformAnalytics: await this.customPlatformAnalyticsService.createCustomPlatformProfileVisit(customPlatformUuid) };
	}
}
