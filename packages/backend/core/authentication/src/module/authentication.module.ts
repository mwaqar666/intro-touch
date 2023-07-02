import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouteRegister } from "@/backend-core/router/interface";
import { GoogleAuthAdapter } from "@/backend-core/authentication/adapters";
import { AuthTokenConst } from "@/backend-core/authentication/const";
import { AuthenticationController } from "@/backend-core/authentication/controller";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import { AuthRouter } from "@/backend-core/authentication/router";
import { AuthAdapterResolverService, AuthService, AuthTokenService, GuardResolverService, HashService } from "@/backend-core/authentication/services";
import type { IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthenticationModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Controllers
		this.container.registerSingleton(AuthenticationController);

		// Services
		this.container.registerSingleton(HashService);
		this.container.registerSingleton(AuthService);
		this.container.registerSingleton(AuthTokenService);

		// Router
		this.container.registerSingleton(AuthRouter);

		// Auth interceptors & services
		this.container.registerSingleton(AuthTokenConst.GuardResolverToken, GuardResolverService);

		// Authentication adapters
		this.container.registerSingleton(AuthTokenConst.GoogleAdapterToken, GoogleAuthAdapter);
		this.container.registerSingleton(AuthTokenConst.AuthAdapterResolverToken, AuthAdapterResolverService);
	}

	public override async boot(): Promise<void> {
		const authRouter: AuthRouter = this.container.resolve(AuthRouter);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		routeRegister.registerRouter(authRouter);

		const googleAdapter: IAuthAdapter<IGoogleAdapter> = this.container.resolve(AuthTokenConst.GoogleAdapterToken);

		const authAdapterResolver: IAuthAdapterResolver = this.container.resolve(AuthTokenConst.AuthAdapterResolverToken);
		authAdapterResolver.addAdapters(googleAdapter);
	}
}
