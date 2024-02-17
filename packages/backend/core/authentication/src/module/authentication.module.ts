import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { FacebookAuthAdapter, GoogleAuthAdapter, SelfAuthAdapter } from "@/backend-core/authentication/adapters";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import { AuthenticationController } from "@/backend-core/authentication/controllers";
import { HashService } from "@/backend-core/authentication/crypt";
import { VerificationTokenService } from "@/backend-core/authentication/dal";
import { AuthenticationDbRegister } from "@/backend-core/authentication/db";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import { AuthAdapterResolver, AuthEntityResolver, GuardResolver } from "@/backend-core/authentication/resolvers";
import { AuthenticationRouter } from "@/backend-core/authentication/router";
import { SignInService, SignUpService, SocialAuthService, VerificationService } from "@/backend-core/authentication/services";
import type { IFacebookAdapter, IGoogleAdapter } from "@/backend-core/authentication/types";
import { EmailUtilService, TokenUtilService } from "@/backend-core/authentication/utils";

export class AuthenticationModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Controllers
		this.container.registerSingleton(AuthenticationController);

		// Auth services
		this.container.registerSingleton(SignInService);
		this.container.registerSingleton(SignUpService);
		this.container.registerSingleton(SocialAuthService);
		this.container.registerSingleton(VerificationService);

		// DAL Services
		this.container.registerSingleton(VerificationTokenService);

		// Util Services
		this.container.registerSingleton(EmailUtilService);
		this.container.registerSingleton(TokenUtilService);

		// Hashing and Encryption Services
		this.container.registerSingleton(AuthenticationTokenConst.HashToken, HashService);

		// Resolver Services
		this.container.registerScoped(AuthenticationTokenConst.AuthEntityResolverToken, AuthEntityResolver);
		this.container.registerSingleton(AuthenticationTokenConst.GuardResolverToken, GuardResolver);
		this.container.registerSingleton(AuthenticationTokenConst.AuthAdapterResolverToken, AuthAdapterResolver);

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
	}

	public override async postBoot(): Promise<void> {
		const selfAdapter: IAuthAdapter = this.container.resolve(AuthenticationTokenConst.SelfAdapterToken);
		const googleAdapter: IAuthAdapter<IGoogleAdapter> = this.container.resolve(AuthenticationTokenConst.GoogleAdapterToken);
		const facebookAdapter: IAuthAdapter<IFacebookAdapter> = this.container.resolve(AuthenticationTokenConst.FacebookAdapterToken);

		const authAdapterResolver: IAuthAdapterResolver = this.container.resolve(AuthenticationTokenConst.AuthAdapterResolverToken);
		authAdapterResolver.addAdapters(selfAdapter, googleAdapter, facebookAdapter);
	}
}
