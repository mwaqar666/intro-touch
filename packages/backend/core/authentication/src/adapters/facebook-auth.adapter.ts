import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiResponse, ILambdaInput } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import type { Adapter } from "sst/node/auth";
import { FacebookAdapter } from "sst/node/auth";
import { BaseAdapter } from "@/backend-core/authentication/base";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord, IFacebookAdapter } from "@/backend-core/authentication/types";

export class FacebookAuthAdapter extends BaseAdapter implements IAuthAdapter<IFacebookAdapter> {
	public constructor(
		// Dependencies
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(RequestProcessorTokenConst.RequestProcessorToken) private readonly requestProcessor: IRequestProcessor,
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

				const { request, context }: ILambdaInput = this.prepareRequestAndContext();

				request.body = JSON.stringify({
					userEmail: claims.email,
					userFirstName: claims.given_name,
					userLastName: claims.family_name,
					userPicture: claims.picture,
				});

				return this.requestProcessor.processRequest(request, context);
			},
		});

		return {
			adapter: facebookAdapter,
			identifier: "facebook",
		};
	}
}
