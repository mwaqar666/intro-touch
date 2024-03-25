import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import type { Adapter } from "sst/node/auth";
import { FacebookAdapter } from "sst/node/auth";
import { AbstractAuthAdapter } from "@/backend-core/authentication/abstract";
import { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapterRecord, IFacebookAdapter } from "@/backend-core/authentication/types";

export class FacebookAuthAdapter extends AbstractAuthAdapter<IFacebookAdapter> {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {
		super();
	}

	public configureAuthAdapter(): IAuthAdapterRecord<IFacebookAdapter> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const facebookAdapter: Adapter = FacebookAdapter({
			clientID: authConfig.facebookClientId,
			clientSecret: authConfig.facebookClientSecret,
			scope: "openid email",
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
			adapter: facebookAdapter,
			identifier: AuthAdapter.Facebook,
		};
	}
}
