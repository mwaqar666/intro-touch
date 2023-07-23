import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { PlatformController } from "@/backend/platform/controller";

export class PlatformRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(PlatformController) private readonly platformController: PlatformController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/platform",
				guards: [AuthRequestGuard],
				routes: [
					{
						path: "/{platformCategoryUuid}",
						method: RouteMethod.GET,
						handler: this.platformController.getPlatforms,
					},
					{
						path: "/categories",
						method: RouteMethod.GET,
						handler: this.platformController.getPlatformCategories,
					},
					{
						path: "/profiles",
						method: RouteMethod.GET,
						handler: this.platformController.getPlatformProfiles,
					},
				],
			},
		];
	}
}
