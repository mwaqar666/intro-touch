import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { FacebookAuthAdapter, GoogleAuthAdapter, SelfAuthAdapter } from "@/backend-core/authentication/adapters";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import { AuthenticationDbRegister } from "@/backend-core/authentication/db/authentication-db.register";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import { HashService, VerificationTokenService } from "@/backend-core/authentication/services";
import { AdapterService } from "@/backend-core/authentication/services/adapter";
import { AuthAdapterResolverService, GuardResolverService } from "@/backend-core/authentication/services/resolver";
import type { IFacebookAdapter, IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthenticationModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Auth services
		this.container.registerSingleton(HashService);
		this.container.registerSingleton(AdapterService);
		this.container.registerSingleton(VerificationTokenService);

		// Resolver Services
		this.container.registerSingleton(AuthenticationTokenConst.GuardResolverToken, GuardResolverService);
		this.container.registerSingleton(AuthenticationTokenConst.AuthAdapterResolverToken, AuthAdapterResolverService);

		// Authentication adapters
		this.container.registerSingleton(AuthenticationTokenConst.SelfAdapterToken, SelfAuthAdapter);
		this.container.registerSingleton(AuthenticationTokenConst.GoogleAdapterToken, GoogleAuthAdapter);
		this.container.registerSingleton(AuthenticationTokenConst.FacebookAdapterToken, FacebookAuthAdapter);

		// Database
		DbExtension.registerDb(AuthenticationDbRegister);
	}

	public override async postBoot(): Promise<void> {
		const selfAdapter: IAuthAdapter = this.container.resolve(AuthenticationTokenConst.SelfAdapterToken);
		const googleAdapter: IAuthAdapter<IGoogleAdapter> = this.container.resolve(AuthenticationTokenConst.GoogleAdapterToken);
		const facebookAdapter: IAuthAdapter<IFacebookAdapter> = this.container.resolve(AuthenticationTokenConst.FacebookAdapterToken);

		const authAdapterResolver: IAuthAdapterResolver = this.container.resolve(AuthenticationTokenConst.AuthAdapterResolverToken);
		authAdapterResolver.addAdapters(selfAdapter, googleAdapter, facebookAdapter);
	}
}
