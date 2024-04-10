import type { UserEntity } from "@/backend/user/db/entities";
import { UserService } from "@/backend/user/services";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import { EntityScopeConst } from "@/backend-core/database/const";
import { HttpStatusCode } from "@/backend-core/request-processor/enums";
import { Response } from "@/backend-core/request-processor/handlers";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { IAuthProvider } from "@/backend-core/authentication/interface";
import { TokenUtilService } from "@/backend-core/authentication/utils";

export class SocialAuthService {
	public constructor(
		// Dependencies

		@Inject(UserService) private readonly userService: UserService,
		@Inject(TokenUtilService) private readonly tokenUtilService: TokenUtilService,
		@Inject(AuthenticationTokenConst.AuthProviderToken) private readonly authProvider: IAuthProvider,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async socialAuth(findOrCreateUserProps: Omit<IFindOrCreateUserProps, "userPassword">): Promise<Response> {
		let created = true;

		let entity: Nullable<UserEntity> = await this.authProvider.retrieveByCredentials({ userEmail: findOrCreateUserProps.userEmail }, { scopes: [EntityScopeConst.isActive] });

		if (entity) created = false;
		else entity = await this.userService.createNewUserWithProfile({ ...findOrCreateUserProps, userPassword: null });

		return this.prepareRedirectionResponse(entity, created);
	}

	private prepareRedirectionResponse(authEntity: UserEntity, created: boolean): Response {
		const token: string = this.tokenUtilService.createAuthenticationToken(authEntity);

		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const redirectUrl: URL = new URL(authConfig.redirectUrl);
		redirectUrl.searchParams.set("token", token);
		redirectUrl.searchParams.set("created", created.toString());

		return App.container.resolve(Response).setStatusCode(HttpStatusCode.Found).setHeaders({
			location: redirectUrl.toString(),
		});
	}
}
