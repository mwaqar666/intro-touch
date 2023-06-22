import { AbstractModule } from "@/backend-core/core/concrete/module";
import { FacebookAuthAdapter, GoogleAuthAdapter } from "@/backend-core/authentication/adapters";
import { AuthTokenConst } from "@/backend-core/authentication/const";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import { AuthAdapterResolverService } from "@/backend-core/authentication/services";
import type { IFacebookAdapter, IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthenticationModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(AuthTokenConst.GoogleAdapterToken, GoogleAuthAdapter);
		this.container.registerSingleton(AuthTokenConst.FacebookAdapterToken, FacebookAuthAdapter);

		this.container.registerSingleton(AuthTokenConst.AuthAdapterResolverToken, AuthAdapterResolverService);
	}

	public override async boot(): Promise<void> {
		const googleAdapter: IAuthAdapter<IGoogleAdapter> = this.container.resolve(AuthTokenConst.GoogleAdapterToken);
		const facebookAdapter: IAuthAdapter<IFacebookAdapter> = this.container.resolve(AuthTokenConst.FacebookAdapterToken);

		const authAdapterResolver: IAuthAdapterResolver = this.container.resolve(AuthTokenConst.AuthAdapterResolverToken);
		authAdapterResolver.addAdapters(googleAdapter, facebookAdapter);
	}
}
