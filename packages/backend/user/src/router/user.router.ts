import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { UserTokenConst } from "@/backend/user/const";
import type { UserController } from "@/backend/user/controller";

export class UserRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(UserTokenConst.UserControllerToken) private readonly userController: UserController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/",
				authorizer: "none",
				routes: [
					{
						path: "/",
						method: RouteMethod.GET,
						handler: this.userController.getUserList,
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
