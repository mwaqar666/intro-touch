import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { FacebookAuthAdapter, GoogleAuthAdapter, SelfAuthAdapter } from "@/backend-core/authentication/adapters";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import { AuthenticationController, PasswordController } from "@/backend-core/authentication/controllers";
import { AuthenticationDbRegister } from "@/backend-core/authentication/db";
import { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthAdapter, IAuthAdapterResolver, IAuthProvider } from "@/backend-core/authentication/interface";
import { AuthProvider } from "@/backend-core/authentication/providers";
import { AuthAdapterResolver, GuardResolver } from "@/backend-core/authentication/resolvers";
import { AuthenticationRouter } from "@/backend-core/authentication/router";
import { BasicAuthService, PasswordManagerService, SocialAuthService } from "@/backend-core/authentication/services/auth";
import { HashService } from "@/backend-core/authentication/services/crypt";
import { EmailUtilService, TokenUtilService } from "@/backend-core/authentication/services/utils";
import { VerificationService } from "@/backend-core/authentication/services/verification";
import type { IFacebookAdapter, IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthenticationModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Controllers
		this.container.registerSingleton(PasswordController);
		this.container.registerSingleton(AuthenticationController);

		// Auth services
		this.container.registerSingleton(BasicAuthService);
		this.container.registerSingleton(SocialAuthService);
		this.container.registerSingleton(VerificationService);

		// Util Services
		this.container.registerSingleton(EmailUtilService);
		this.container.registerSingleton(TokenUtilService);

		// Hashing and Encryption Services
		this.container.registerSingleton(HashService);

		// Resolver Services
		this.container.registerSingleton(AuthenticationTokenConst.GuardResolverToken, GuardResolver);
		this.container.registerSingleton(AuthenticationTokenConst.AuthAdapterResolverToken, AuthAdapterResolver);

		// Authentication Providers
		this.container.registerSingleton(AuthenticationTokenConst.AuthProviderToken, AuthProvider);
		this.container.registerSingleton(AuthenticationTokenConst.PasswordManagerToken, PasswordManagerService);

		// Authentication Adapters
		this.container.registerSingleton(AuthenticationTokenConst.SelfAdapterToken, SelfAuthAdapter);
		this.container.registerSingleton(AuthenticationTokenConst.GoogleAdapterToken, GoogleAuthAdapter);
		this.container.registerSingleton(AuthenticationTokenConst.FacebookAdapterToken, FacebookAuthAdapter);

		// Database
		DbExtension.registerDb(AuthenticationDbRegister);
	}

	public override async boot(): Promise<void> {
		// Routing
		RouterExtension.addRouter(AuthenticationRouter);

		// Configuring Authentication Provider
		const authProvider: IAuthProvider = this.container.resolve(AuthenticationTokenConst.AuthProviderToken);
		await authProvider.useAuthDriver(AuthDriver.DEFAULT);
	}

	public override async postBoot(): Promise<void> {
		const selfAdapter: IAuthAdapter = this.container.resolve(AuthenticationTokenConst.SelfAdapterToken);
		const googleAdapter: IAuthAdapter<IGoogleAdapter> = this.container.resolve(AuthenticationTokenConst.GoogleAdapterToken);
		const facebookAdapter: IAuthAdapter<IFacebookAdapter> = this.container.resolve(AuthenticationTokenConst.FacebookAdapterToken);

		const authAdapterResolver: IAuthAdapterResolver = this.container.resolve(AuthenticationTokenConst.AuthAdapterResolverToken);
		authAdapterResolver.addAdapters(selfAdapter, googleAdapter, facebookAdapter);
	}
}
