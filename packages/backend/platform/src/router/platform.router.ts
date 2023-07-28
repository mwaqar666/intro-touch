import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { CustomPlatformController, PlatformCategoryController, PlatformController } from "@/backend/platform/controller";

export class PlatformRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(PlatformController) private readonly platformController: PlatformController,
		@Inject(CustomPlatformController) private readonly customPlatformController: CustomPlatformController,
		@Inject(PlatformCategoryController) private readonly platformCategoryController: PlatformCategoryController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/platform",
				guards: [AuthRequestGuard],
				routes: [
					{
						path: "/category",
						method: RouteMethod.GET,
						handler: this.platformCategoryController.getPlatformCategories,
					},
					{
						path: "/builtin/{platformCategoryUuid}",
						method: RouteMethod.GET,
						handler: this.platformController.getPlatformsByPlatformCategory,
					},
					{
						path: "/custom/{platformCategoryUuid}",
						method: RouteMethod.GET,
						handler: this.customPlatformController.getCustomPlatformsByPlatformCategory,
					},
					{
						path: "/owned",
						method: RouteMethod.GET,
						handler: this.platformController.getUserOwnedPlatforms,
					},
				],
			},
		];
	}
}
