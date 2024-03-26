import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { GoogleAdapter } from "sst/node/auth";
import type { Adapter } from "sst/node/auth/adapter/adapter";
import { AbstractAuthAdapter } from "@/backend-core/authentication/abstract";
import { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapterRecord, IGoogleAdapter } from "@/backend-core/authentication/types";

export class GoogleAuthAdapter extends AbstractAuthAdapter<IGoogleAdapter> {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {
		super();
	}

	public configureAuthAdapter(): IAuthAdapterRecord<IGoogleAdapter> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const googleAdapter: Adapter = GoogleAdapter({
			mode: "oidc",
			clientID: authConfig.googleClientId,
			onSuccess: async (tokenSet: TokenSet): Promise<ApiResponse> => {
				const claims: IdTokenClaims = tokenSet.claims();

				return this.processRequest((request: Request): void => {
					request.setBody({
						userEmail: claims.email,
						userFirstName: claims.given_name,
						userLastName: claims.family_name,
						userPicture: claims.picture,
					});
				});
			},
		});

		return {
			adapter: googleAdapter,
			identifier: AuthAdapter.Google,
		};
	}
}
