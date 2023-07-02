import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { AuthenticationController } from "@/backend-core/authentication/controller";

export class AuthRouter implements IRouter {
	public constructor(
		// Dependencies

		@Inject(AuthenticationController) private readonly authenticationController: AuthenticationController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "authentication",
				routes: [
					{
						path: "login",
						method: RouteMethod.POST,
						handler: this.authenticationController.login,
					},
					{
						path: "register",
						method: RouteMethod.POST,
						handler: this.authenticationController.login,
					},
				],
			},
		];
	}
}
