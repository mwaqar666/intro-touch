import type { ApiResponse } from "@/stacks/types";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { GoogleAdapter, Session } from "sst/node/auth";
import type { IAuthAdapter } from "@/backend-core/auth/interface";
import type { IAuthAdapterRecord, IGoogleAdapter } from "@/backend-core/auth/types";

export class GoogleAuthAdapter implements IAuthAdapter<IGoogleAdapter> {
	public configureAuthAdapter(): IAuthAdapterRecord<IGoogleAdapter> {
		const googleAdapter = GoogleAdapter({
			mode: "oidc",
			clientID: "",
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
			identifier: "google",
			adapter: googleAdapter,
		};
	}
}
