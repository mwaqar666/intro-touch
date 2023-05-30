import { RouteMethod } from "@/backend/router/enum";
import type { IRoute } from "@/backend/router/interface";
import { AbstractRouter } from "@/backend/router/services";
import type { UserController } from "@/backend/user/controller";

export interface IUserRouter {
	user: UserController;
}

export class UserRouter extends AbstractRouter<IUserRouter> {
	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/user",
				authorizer: "none",
				routes: [
					{
						path: "/",
						method: RouteMethod.GET,
						handler: this.controllers.user.getUserList,
					},
					{
						path: "/{userId}",
						method: RouteMethod.GET,
						handler: this.controllers.user.getUser,
					},
					{
						path: "/{userId}/delete",
						method: RouteMethod.DELETE,
						handler: this.controllers.user.deleteUser,
					},
				],
			},
		];
	}
}
