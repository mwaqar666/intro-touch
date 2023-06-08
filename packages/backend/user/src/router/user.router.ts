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
				prefix: "/user",
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
						path: "/{userId}/delete",
						method: RouteMethod.DELETE,
						handler: this.userController.deleteUser,
					},
				],
			},
		];
	}
}
