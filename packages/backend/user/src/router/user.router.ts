import { RouteMethod } from "@/backend/router/enum";
import type { IRoute, IRouter } from "@/backend/router/interface";
import { Service } from "typedi";
import type { UserController } from "@/backend/user/controller";

@Service()
export class UserRouter implements IRouter {
	public constructor(
		// Dependencies
		private readonly userController: UserController,
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
