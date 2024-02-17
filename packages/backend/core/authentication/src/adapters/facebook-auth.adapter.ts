import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { Request } from "@/backend-core/request-processor/handlers";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import type { Adapter } from "sst/node/auth";
import { FacebookAdapter } from "sst/node/auth";
import { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord, IFacebookAdapter } from "@/backend-core/authentication/types";

export class FacebookAuthAdapter implements IAuthAdapter<IFacebookAdapter> {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public configureAuthAdapter(): IAuthAdapterRecord<IFacebookAdapter> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const facebookAdapter: Adapter = FacebookAdapter({
			clientID: authConfig.facebookClientId,
			clientSecret: authConfig.facebookClientSecret,
			scope: "openid email",
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
			adapter: facebookAdapter,
			identifier: AuthAdapter.FACEBOOK,
		};
	}
}
