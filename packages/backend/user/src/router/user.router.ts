import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { UserController, UserProfileController } from "@/backend/user/controller";

export class UserRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(UserController) private readonly userController: UserController,
		@Inject(UserProfileController) private readonly userProfileController: UserProfileController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
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
						path: "/profiles",
						method: RouteMethod.GET,
						handler: this.userProfileController.getAuthUserProfileDropdown,
					},
				],
			},
		];
	}
}
