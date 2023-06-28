import { AuthRequestGuard } from "@/backend-core/authentication/guards";
import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { UserController } from "@/backend/user/controller";

export class UserRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(UserController) private readonly userController: UserController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/user",
				routes: [
					{
						path: "/",
						method: RouteMethod.GET,
						handler: this.userController.getUserList,
						guards: [AuthRequestGuard],
					},
					{
						path: "/{userId}",
						method: RouteMethod.GET,
						handler: this.userController.getUser,
					},
					{
						path: "/create/{userId}",
						method: RouteMethod.POST,
						handler: this.userController.createUser,
					},
					{
						path: "/update/{userId}",
						method: RouteMethod.PUT,
						handler: this.userController.updateUser,
					},
					{
						path: "/delete/{userId}",
						method: RouteMethod.DELETE,
						handler: this.userController.deleteUser,
					},
				],
			},
		];
	}
}
