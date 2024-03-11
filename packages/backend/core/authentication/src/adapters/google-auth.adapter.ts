import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { Request } from "@/backend-core/request-processor/handlers";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { GoogleAdapter } from "sst/node/auth";
import type { Adapter } from "sst/node/auth/adapter/adapter";
import { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord, IGoogleAdapter } from "@/backend-core/authentication/types";

export class GoogleAuthAdapter implements IAuthAdapter<IGoogleAdapter> {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public configureAuthAdapter(): IAuthAdapterRecord<IGoogleAdapter> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const googleAdapter: Adapter = GoogleAdapter({
			mode: "oidc",
			clientID: authConfig.googleClientId,
			onSuccess: async (tokenSet: TokenSet): Promise<ApiResponse> => {
				const claims: IdTokenClaims = tokenSet.claims();

				const request: Request = App.container.resolve(Request);
				const requestProcessor: IRequestProcessor = App.container.resolve(RequestProcessorTokenConst.RequestProcessorToken);

				request.setBody({
					userEmail: claims.email,
					userFirstName: claims.given_name,
					userLastName: claims.family_name,
					userPicture: claims.picture,
				});

				return requestProcessor.processRequest(request);
			},
		});

		return {
			adapter: googleAdapter,
			identifier: AuthAdapter.Google,
		};
	}
}
