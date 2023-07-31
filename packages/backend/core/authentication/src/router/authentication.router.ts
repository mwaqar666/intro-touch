import { RouteMethod, RouteType } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { AuthenticationController } from "@/backend-core/authentication/controllers";

export class AuthenticationRouter implements IRouter {
	public constructor(
		// Dependencies

		@Inject(AuthenticationController) private readonly authenticationController: AuthenticationController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/auth",
				routeType: RouteType.APPLICATION,
				routes: [
					{
						prefix: "/self",
						routes: [
							{
								path: "/login",
								method: RouteMethod.POST,
								handler: this.authenticationController.basicLogin,
							},
							{
								path: "/register",
								method: RouteMethod.POST,
								handler: this.authenticationController.basicRegister,
							},
							{
								path: "/verify",
								method: RouteMethod.POST,
								handler: this.authenticationController.verifyRegisteredEmail,
							},
							{
								path: "/resend",
								method: RouteMethod.POST,
								handler: this.authenticationController.resendEmailVerificationToken,
							},
						],
					},
					{
						prefix: "/google",
						routes: [
							{
								path: "/callback",
								method: RouteMethod.GET,
								handler: this.authenticationController.socialAuth,
							},
						],
					},
					{
						prefix: "/facebook",
						routes: [
							{
								path: "/callback",
								method: RouteMethod.GET,
								handler: this.authenticationController.socialAuth,
							},
						],
					},
				],
			},
		];
	}
}
