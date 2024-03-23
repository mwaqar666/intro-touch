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
		@Inject(PlatformProfileController) private readonly platformProfileController: PlatformProfileController,
		@Inject(PlatformCategoryController) private readonly platformCategoryController: PlatformCategoryController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/platform",
				routes: [
					{
						path: "/owned/{userProfileUuid}/{platformCategoryUuid}",
						method: RouteMethod.Get,
						responseInterceptors: [UserOwnedPlatformResponseInterceptor],
						handler: this.platformProfileController.getUserOwnedPlatforms,
					},
					{
						prefix: "/category",
						routes: [
							{
								path: "/list",
								method: RouteMethod.Get,
								handler: this.platformCategoryController.getPlatformCategoryList,
							},
							{
								path: "/view/{platformCategoryUuid}",
								method: RouteMethod.Get,
								handler: this.platformCategoryController.getPlatformCategory,
							},
						],
					},
					{
						prefix: "/",
						guards: [AuthRequestGuard],
						routes: [
							{
								prefix: "/custom",
								routes: [
									{
										path: "/list/{userProfileUuid}/{platformCategoryUuid}",
										method: RouteMethod.Get,
										handler: this.customPlatformController.getCustomPlatformList,
									},
									{
										path: "/view/{customPlatformUuid}",
										method: RouteMethod.Get,
										handler: this.customPlatformController.getCustomPlatform,
									},
									{
										path: "/create/{userProfileUuid}/{platformCategoryUuid}",
										method: RouteMethod.Post,
										handler: this.customPlatformController.createCustomPlatform,
									},
									{
										path: "/update/{customPlatformUuid}",
										method: RouteMethod.Patch,
										handler: this.customPlatformController.updateCustomPlatform,
									},
									{
										path: "/delete/{customPlatformUuid}",
										method: RouteMethod.Delete,
										handler: this.customPlatformController.deleteCustomPlatform,
									},
								],
							},
							{
								prefix: "/builtin",
								routes: [
									{
										path: "/list/{platformCategoryUuid}",
										method: RouteMethod.Get,
										handler: this.platformController.getPlatformList,
									},
									{
										path: "/view/{platformUuid}",
										method: RouteMethod.Get,
										handler: this.platformController.getPlatform,
									},
									{
										path: "/create/{platformCategoryUuid}",
										method: RouteMethod.Post,
										handler: this.platformController.createBuiltInPlatform,
									},
									{
										path: "/update/{platformUuid}",
										method: RouteMethod.Patch,
										handler: this.platformController.updateBuiltInPlatform,
									},
									{
										path: "/delete/{platformUuid}",
										method: RouteMethod.Delete,
										handler: this.platformController.deleteBuiltInPlatform,
									},
									{
										prefix: "/profile",
										routes: [
											{
												path: "/create/{userProfileUuid}/{platformUuid}",
												method: RouteMethod.Post,
												handler: this.platformProfileController.createPlatformProfile,
											},
											{
												path: "/update/{platformProfileUuid}",
												method: RouteMethod.Patch,
												handler: this.platformProfileController.updatePlatformProfile,
											},
											{
												path: "/delete/{platformProfileUuid}",
												method: RouteMethod.Delete,
												handler: this.platformProfileController.deletePlatformProfile,
											},
										],
									},
								],
							},
						],
					},
				],
			},
		];
	}
}
