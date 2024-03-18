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
						method: RouteMethod.Get,
						handler: this.platformCategoryController.getPlatformCategories,
					},
					{
						path: "/builtin/{platformCategoryUuid}",
						method: RouteMethod.Get,
						handler: this.platformController.getPlatformsByPlatformCategory,
					},
					{
						path: "/custom/{platformCategoryUuid}",
						method: RouteMethod.Get,
						handler: this.customPlatformController.getCustomPlatformsByPlatformCategory,
					},
					{
						path: "/owned/{userProfileUuid}/{platformCategoryUuid}",
						method: RouteMethod.Get,
						responseInterceptors: [UserOwnedPlatformResponseInterceptor],
						handler: this.platformController.getUserOwnedPlatforms,
					},
					{
						path: "/builtin/{platformProfileUuid}",
						method: RouteMethod.Patch,
						handler: this.platformProfileController.updateBuiltInPlatform,
					},
					{
						path: "/custom/{customPlatformUuid}",
						method: RouteMethod.Patch,
						handler: this.customPlatformController.updateCustomPlatform,
					},
					{
						path: "/builtin",
						method: RouteMethod.Post,
						handler: this.platformProfileController.createBuiltInPlatform,
					},
					{
						path: "custom",
						method: RouteMethod.Post,
						handler: this.customPlatformController.createCustomPlatform,
					},
				],
			},
		];
	}
}
