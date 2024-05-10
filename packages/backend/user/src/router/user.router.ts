import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { UserContactController, UserController, UserProfileController } from "@/backend/user/controller";

export class UserRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(UserController) private readonly userController: UserController,
		@Inject(UserContactController) private readonly userContactController: UserContactController,
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
						prefix: "/contact",
						routes: [
							{
								path: "/create/{userUuid}",
								method: RouteMethod.Post,
								handler: this.userContactController.createUserContact,
							},
						],
					},
					{
						prefix: "/",
						guards: [AuthRequestGuard],
						routes: [
							{
								path: "/list",
								method: RouteMethod.Get,
								handler: this.userController.getUserList,
							},
							{
								prefix: "/contact",
								routes: [
									{
										path: "/list",
										method: RouteMethod.Get,
										handler: this.userContactController.getUserContactList,
									},
								],
							},
							{
								prefix: "/profile",
								routes: [
									{
										path: "/list",
										method: RouteMethod.Get,
										handler: this.userProfileController.getUserProfileList,
									},
									{
										path: "/view/{userProfileUuid}",
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
									{
										path: "/live/{userProfileUuid}",
										method: RouteMethod.Patch,
										handler: this.userProfileController.changeLiveProfile,
									},
									{
										path: "/delete/{userProfileUuid}",
										method: RouteMethod.Delete,
										handler: this.userProfileController.deleteUserProfile,
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
