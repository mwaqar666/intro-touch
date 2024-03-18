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
				routes: [
					{
						path: "/preview/{userUsername}",
						method: RouteMethod.Get,
						handler: this.userController.publicPreview,
					},
					{
						prefix: "/",
						guards: [AuthRequestGuard],
						routes: [
							{
								path: "/me",
								method: RouteMethod.Get,
								handler: this.userController.me,
							},
							{
								path: "/reset-password",
								method: RouteMethod.Post,
								handler: this.userController.resetPassword,
							},
							{
								path: "/profiles",
								method: RouteMethod.Get,
								handler: this.userProfileController.getAuthUserProfileDropdown,
							},
							{
								prefix: "/profile",
								routes: [
									{
										path: "/{userProfileUuid}",
										method: RouteMethod.Get,
										handler: this.userProfileController.getUserProfile,
									},
									{
										path: "/create",
										method: RouteMethod.Post,
										handler: this.userProfileController.createUserProfile,
									},
									{
										path: "/update/{userProfileUuid}",
										method: RouteMethod.Patch,
										handler: this.userProfileController.updateUserProfile,
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
