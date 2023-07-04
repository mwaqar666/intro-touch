import { AbstractModule } from "@/backend-core/core/concrete/module";
import { GoogleAuthAdapter, SelfAuthAdapter } from "@/backend-core/authentication/adapters";
import { AuthTokenConst } from "@/backend-core/authentication/const";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import { HashService } from "@/backend-core/authentication/services";
import { AdapterService } from "@/backend-core/authentication/services/adapter";
import { AuthAdapterResolverService, GuardResolverService } from "@/backend-core/authentication/services/resolver";
import type { IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthenticationModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Auth services
		this.container.registerSingleton(HashService);
		this.container.registerSingleton(AdapterService);

		// Resolver Services
		this.container.registerSingleton(AuthTokenConst.GuardResolverToken, GuardResolverService);
		this.container.registerSingleton(AuthTokenConst.AuthAdapterResolverToken, AuthAdapterResolverService);

		// Authentication adapters
		this.container.registerSingleton(AuthTokenConst.SelfAdapterToken, SelfAuthAdapter);
		this.container.registerSingleton(AuthTokenConst.GoogleAdapterToken, GoogleAuthAdapter);
	}

	public override async boot(): Promise<void> {
		const selfAdapter: IAuthAdapter = this.container.resolve(AuthTokenConst.SelfAdapterToken);
		const googleAdapter: IAuthAdapter<IGoogleAdapter> = this.container.resolve(AuthTokenConst.GoogleAdapterToken);

		const authAdapterResolver: IAuthAdapterResolver = this.container.resolve(AuthTokenConst.AuthAdapterResolverToken);
		authAdapterResolver.addAdapters(selfAdapter, googleAdapter);
	}
}
