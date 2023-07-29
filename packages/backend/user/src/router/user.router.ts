import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { UserAdminController, UserController, UserProfileController } from "@/backend/user/controller";

export class UserRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(UserController) private readonly userController: UserController,
		@Inject(UserAdminController) private readonly userAdminController: UserAdminController,
		@Inject(UserProfileController) private readonly userProfileController: UserProfileController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/admin/user",
				guards: [AuthRequestGuard],
				routes: [
					{
						path: "/list",
						method: RouteMethod.GET,
						handler: this.userAdminController.listUser,
					},
					{
						path: "/view/{userUuid}",
						method: RouteMethod.GET,
						handler: this.userAdminController.viewUser,
					},
					{
						path: "/update/{userUuid}",
						method: RouteMethod.PATCH,
						handler: this.userAdminController.updateUser,
					},
					{
						path: "/delete/{userUuid}",
						method: RouteMethod.DELETE,
						handler: this.userAdminController.deleteUser,
					},
				],
			},
			{
				prefix: "/user",
				guards: [AuthRequestGuard],
				routes: [
					{
						path: "/me",
						method: RouteMethod.GET,
						handler: this.userController.me,
					},
					{
						path: "/delete",
						method: RouteMethod.DELETE,
						handler: this.userController.deleteAccount,
					},
					{
						path: "/profiles",
						method: RouteMethod.GET,
						handler: this.userProfileController.getUserProfiles,
					},
					{
						prefix: "/profile",
						routes: [
							{
								path: "/{userProfileUuid}",
								method: RouteMethod.GET,
								handler: this.userProfileController.getUserProfile,
							},
							{
								path: "/update/{userProfileUuid}",
								method: RouteMethod.PATCH,
								handler: this.userProfileController.updateUserProfile,
							},
						],
					},
				],
			},
		];
	}
}
