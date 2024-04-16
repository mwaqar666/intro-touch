import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { AnalyticsController } from "@/backend/analytics/controllers";
import { AnalyticsResponseInterceptor } from "@/backend/analytics/interceptors/response";

export class AnalyticsRouter implements IRouter {
	public constructor(
		// Dependencies

		@Inject(AnalyticsController) private readonly analyticsController: AnalyticsController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/analytics",
				routes: [
					{
						path: "/view/{userProfileUuid}",
						guards: [AuthRequestGuard],
						method: RouteMethod.Get,
						responseInterceptors: [AnalyticsResponseInterceptor],
						handler: this.analyticsController.getUserProfileAnalytics,
					},
					{
						prefix: "/create",
						routes: [
							{
								path: "/platform/{platformProfileUuid}",
								method: RouteMethod.Post,
								handler: this.analyticsController.createPlatformProfileVisit,
							},
							{
								path: "/custom-platform/{customPlatformUuid}",
								method: RouteMethod.Post,
								handler: this.analyticsController.createCustomPlatformProfileVisit,
							},
						],
					},
				],
			},
		];
	}
}
