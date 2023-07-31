import type { UserEntity } from "@/backend/user/db/entities";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { GoogleAdapter } from "sst/node/auth";
import type { Adapter } from "sst/node/auth/adapter/adapter";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import { AuthenticationService } from "@/backend-core/authentication/services";
import { AuthRedirectionService } from "@/backend-core/authentication/services/auth-utils";
import type { IAuthAdapterRecord, IGoogleAdapter } from "@/backend-core/authentication/types";

export class GoogleAuthAdapter implements IAuthAdapter<IGoogleAdapter> {
	public constructor(
		// Dependencies
		@Inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
		@Inject(AuthRedirectionService) private readonly authRedirectionService: AuthRedirectionService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public configureAuthAdapter(): IAuthAdapterRecord<IGoogleAdapter> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const googleAdapter: Adapter = GoogleAdapter({
			mode: "oidc",
			clientID: authConfig.googleClientId,
			onSuccess: async (tokenSet: TokenSet): Promise<ApiResponse> => {
				const claims: IdTokenClaims = tokenSet.claims();

				const [userEntity, created]: [UserEntity, boolean] = await this.authenticationService.findOrCreateUser({
					userEmail: claims.email ?? "",
					userFirstName: claims.given_name ?? "",
					userLastName: claims.family_name ?? "",
					userPicture: claims.picture ?? "",
					userPassword: null,
				});

				return this.authRedirectionService.prepareRedirectionResponse(userEntity, created);
			},
		});

		return {
			identifier: "google",
			adapter: googleAdapter,
		};
	}
}
