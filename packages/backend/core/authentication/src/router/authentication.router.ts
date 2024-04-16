import { RouteMethod, RouteType } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { AuthenticationController, PasswordController } from "@/backend-core/authentication/controllers";
import { AuthRequestGuard } from "@/backend-core/authentication/guards";

export class AuthenticationRouter implements IRouter {
	public constructor(
		// Dependencies

		@Inject(PasswordController) private readonly passwordController: PasswordController,
		@Inject(AuthenticationController) private readonly authController: AuthenticationController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/auth",
				routeType: RouteType.Application,
				routes: [
					{
						prefix: "/self",
						routes: [
							{
								path: "/login",
								method: RouteMethod.Post,
								handler: this.authController.basicLogin,
							},
							{
								path: "/register",
								method: RouteMethod.Post,
								handler: this.authController.basicRegister,
							},
							{
								path: "/verify",
								method: RouteMethod.Post,
								handler: this.authController.verifyEmail,
							},
							{
								path: "/verify-resend",
								method: RouteMethod.Post,
								handler: this.authController.resendEmailVerificationLink,
							},
							{
								path: "/password-change",
								method: RouteMethod.Post,
								guards: [AuthRequestGuard],
								handler: this.passwordController.changePassword,
							},
							{
								path: "/password-reset-link",
								method: RouteMethod.Post,
								handler: this.passwordController.sendPasswordResetLink,
							},
							{
								path: "/password-reset-verify",
								method: RouteMethod.Post,
								handler: this.passwordController.resetPassword,
							},
						],
					},
					// {
					// 	prefix: "/google",
					// 	routes: [
					// 		{
					// 			path: "/callback",
					// 			method: RouteMethod.Post,
					// 			handler: this.authController.socialAuth,
					// 		},
					// 	],
					// },
					// {
					// 	prefix: "/facebook",
					// 	routes: [
					// 		{
					// 			path: "/callback",
					// 			method: RouteMethod.Post,
					// 			handler: this.authController.socialAuth,
					// 		},
					// 	],
					// },
				],
			},
		];
	}
}
