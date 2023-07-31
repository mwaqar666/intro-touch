import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiResponse, ILambdaInput } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { GoogleAdapter } from "sst/node/auth";
import type { Adapter } from "sst/node/auth/adapter/adapter";
import { BaseAdapter } from "@/backend-core/authentication/base";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord, IGoogleAdapter } from "@/backend-core/authentication/types";

export class GoogleAuthAdapter extends BaseAdapter implements IAuthAdapter<IGoogleAdapter> {
	public constructor(
		// Dependencies
		@Inject(RequestProcessorTokenConst.RequestProcessorToken) private readonly requestProcessor: IRequestProcessor,
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
			identifier: "google",
			adapter: googleAdapter,
		};
	}
}
