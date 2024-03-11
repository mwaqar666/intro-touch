import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { CustomPlatformController, PlatformCategoryController, PlatformController, PlatformProfileController } from "@/backend/platform/controller";
import { UserOwnedPlatformResponseInterceptor } from "@/backend/platform/interceptors";

export class PlatformRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(PlatformController) private readonly platformController: PlatformController,
		@Inject(CustomPlatformController) private readonly customPlatformController: CustomPlatformController,
		@Inject(PlatformCategoryController) private readonly platformCategoryController: PlatformCategoryController,
		@Inject(PlatformProfileController) private readonly platformProfileController: PlatformProfileController,
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
						path: "/owned/{userProfileUuid}/{platformCategoryUuid}",
						method: RouteMethod.GET,
						responseInterceptors: [UserOwnedPlatformResponseInterceptor],
						handler: this.platformController.getUserOwnedPlatforms,
					},
					{
						path: "/builtin/{platformProfileUuid}",
						method: RouteMethod.PATCH,
						handler: this.platformProfileController.updateBuiltInPlatform,
					},
					{
						path: "/custom/{customPlatformUuid}",
						method: RouteMethod.PATCH,
						handler: this.customPlatformController.updateCustomPlatform,
					},
				],
			},
		];
	}
}
