import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestHandler, IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { IAppRequest } from "@/backend-core/request-processor/types";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { GoogleAdapter } from "sst/node/auth";
import type { Adapter } from "sst/node/auth/adapter/adapter";
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

				const requestHandler: IRequestHandler = App.container.resolve(RequestProcessorTokenConst.RequestHandlerToken);
				const requestProcessor: IRequestProcessor = App.container.resolve(RequestProcessorTokenConst.RequestProcessorToken);

				const request: IAppRequest = requestHandler.getRequest();

				request.body = {
					userEmail: claims.email,
					userFirstName: claims.given_name,
					userLastName: claims.family_name,
					userPicture: claims.picture,
				};

				return requestProcessor.processRequest(request, requestHandler.getContext());
			},
		});

		return {
			identifier: "google",
			adapter: googleAdapter,
		};
	}
}
