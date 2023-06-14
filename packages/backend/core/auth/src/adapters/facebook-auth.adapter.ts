import type { ApiResponse } from "@/stacks/types";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { FacebookAdapter, Session } from "sst/node/auth";
import type { IAuthAdapter } from "@/backend-core/auth/interface";
import type { IAuthAdapterRecord, IFacebookAdapter } from "@/backend-core/auth/types";

export class FacebookAuthAdapter implements IAuthAdapter<IFacebookAdapter> {
	public configureAuthAdapter(): IAuthAdapterRecord<IFacebookAdapter> {
		const facebookAdapter = FacebookAdapter({
			clientID: "",
			clientSecret: "",
			scope: "",
			onSuccess: async (tokenSet: TokenSet): Promise<ApiResponse> => {
				const claims: IdTokenClaims = tokenSet.claims();

				console.log(claims.email);

				return Session.parameter({
					redirect: "https://example.com",
					type: "user",
					properties: {
						userUuid: "123456789",
					},
				});
			},
		});

		return {
			identifier: "facebook",
			adapter: facebookAdapter,
		};
	}
}
