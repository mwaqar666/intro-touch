import { AbstractModule } from "@/backend-core/core/concrete/module";
import { GoogleAuthAdapter } from "@/backend-core/authentication/adapters";
import { AuthTokenConst } from "@/backend-core/authentication/const";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import { AuthAdapterResolverService, GuardResolverService } from "@/backend-core/authentication/services";
import type { IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthenticationModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Auth interceptors & services
		this.container.registerSingleton(AuthTokenConst.GuardResolverToken, GuardResolverService);

		// Authentication adapters
		this.container.registerSingleton(AuthTokenConst.GoogleAdapterToken, GoogleAuthAdapter);
		this.container.registerSingleton(AuthTokenConst.AuthAdapterResolverToken, AuthAdapterResolverService);
	}

	public override async boot(): Promise<void> {
		const googleAdapter: IAuthAdapter<IGoogleAdapter> = this.container.resolve(AuthTokenConst.GoogleAdapterToken);

		const authAdapterResolver: IAuthAdapterResolver = this.container.resolve(AuthTokenConst.AuthAdapterResolverToken);
		authAdapterResolver.addAdapters(googleAdapter);
	}
}
