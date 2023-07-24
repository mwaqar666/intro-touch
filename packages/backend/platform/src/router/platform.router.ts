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
				routes: [
					{
						path: "/categories",
						method: RouteMethod.GET,
						handler: this.platformController.getPlatformCategories,
					},
					{
						path: "/category/{platformCategoryUuid}/platforms",
						method: RouteMethod.GET,
						handler: this.platformController.getPlatformsByPlatformCategory,
					},
					{
						path: "/category/{platformCategoryUuid}/custom-platforms",
						method: RouteMethod.GET,
						handler: this.platformController.getCustomPlatformsByPlatformCategory,
					},
					{
						path: "/profiles/{userProfileUuid}",
						method: RouteMethod.GET,
						handler: this.platformController.getUserOwnedPlatforms,
					},
				],
			},
		];
	}
}
