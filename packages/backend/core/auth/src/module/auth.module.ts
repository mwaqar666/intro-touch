import { AbstractModule } from "@/backend-core/core/concrete/module";
import { FacebookAuthAdapter, GoogleAuthAdapter } from "@/backend-core/auth/adapters";
import { AuthTokenConst } from "@/backend-core/auth/const";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/auth/interface";
import { AuthAdapterResolverService } from "@/backend-core/auth/services";
import type { IFacebookAdapter, IGoogleAdapter } from "@/backend-core/auth/types";

export class AuthModule extends AbstractModule {
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
