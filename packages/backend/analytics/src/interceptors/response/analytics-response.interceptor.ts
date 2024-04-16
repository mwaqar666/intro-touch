import type { CustomPlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { App } from "@/backend-core/core/extensions";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import { Response } from "@/backend-core/request-processor/handlers";
import type { IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { Nullable } from "@/stacks/types";
import type { BuiltinPlatformAnalytics, CustomPlatformAnalytics, PlatformAnalytics, ProfileAnalyticsResponseDto, ProfileAnalyticsTransformedResponseDto } from "@/backend/analytics/dto/profile-analytics";

export class AnalyticsResponseInterceptor implements IResponseInterceptor<Request, Response<ProfileAnalyticsResponseDto>, Response<ProfileAnalyticsTransformedResponseDto>> {
	public intercept(_: Request, response: Response<ProfileAnalyticsResponseDto>): Response<ProfileAnalyticsTransformedResponseDto> {
		const analyticsResponse: Nullable<ProfileAnalyticsResponseDto> = response.getData();

		if (!analyticsResponse) throw new InternalServerException();

		const builtInPlatformAnalytics: Array<BuiltinPlatformAnalytics> = analyticsResponse.platformVisits.map((platformProfile: PlatformProfileEntity): BuiltinPlatformAnalytics => {
			return {
				platformType: "builtIn",
				platformUuid: platformProfile.platformProfilePlatform.platformUuid,
				platformName: platformProfile.platformProfilePlatform.platformName,
				platformIcon: platformProfile.platformProfilePlatform.platformIcon,
				platformProfileUuid: platformProfile.platformProfileUuid,
				platformProfileIdentity: platformProfile.platformProfileIdentity,
				platformVisits: platformProfile.platformProfilePlatformAnalytics.length,
			};
		});

		const customPlatformAnalytics: Array<CustomPlatformAnalytics> = analyticsResponse.customPlatformVisits.map((customPlatform: CustomPlatformEntity): CustomPlatformAnalytics => {
			return {
				platformType: "custom",
				platformUuid: customPlatform.customPlatformUuid,
				platformName: customPlatform.customPlatformName,
				platformIcon: customPlatform.customPlatformIcon,
				platformProfileUuid: customPlatform.customPlatformUuid,
				platformProfileIdentity: customPlatform.customPlatformIdentity,
				platformVisits: customPlatform.customPlatformCustomPlatformAnalytics.length,
			};
		});

		const analytics: Array<PlatformAnalytics> = [...builtInPlatformAnalytics, ...customPlatformAnalytics];

		const transformedResponse: Response<ProfileAnalyticsTransformedResponseDto> = App.container.resolve(Response<ProfileAnalyticsTransformedResponseDto>);

		return transformedResponse.handle(response).setData({ analytics });
	}
}
