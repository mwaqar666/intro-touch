import type { UserEntity } from "@/backend/user/db/entities";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import { Session } from "sst/node/auth";
import { AuthTokenService } from "@/backend-core/authentication/services/auth-utils/auth-token.service";

export class AuthRedirectionService {
	public constructor(
		// Dependencies

		@Inject(AuthTokenService) private readonly authTokenService: AuthTokenService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public prepareRedirectionResponse(authEntity: UserEntity, created: boolean): ApiResponse {
		return Session.parameter({
			redirect: this.prepareAuthRedirectionUrl(created).toString(),
			type: "user",
			properties: this.authTokenService.createAuthPayload(authEntity),
			options: this.authTokenService.createTokenProps(authEntity),
		});
	}

	private prepareAuthRedirectionUrl(created: boolean): URL {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const redirectUrl: URL = new URL(authConfig.redirectUrl);
		redirectUrl.searchParams.set("created", created.toString());

		return redirectUrl;
	}
}
