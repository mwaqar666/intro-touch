import type { UserEntity } from "@/backend/user/db/entities";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { HttpStatusCode } from "@/backend-core/request-processor/enums";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { ISuccessfulResponse } from "@/backend-core/request-processor/types";
import { Inject } from "iocc";
import { Session } from "sst/node/auth";
import { AuthTokenService } from "@/backend-core/authentication/services/auth-utils/auth-token.service";

export class AuthRedirectionService {
	public constructor(
		// Dependencies

		@Inject(AuthTokenService) private readonly authTokenService: AuthTokenService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(RequestProcessorTokenConst.ResponseHandlerToken) private readonly responseHandler: IResponseHandler,
	) {}

	public prepareRedirectionResponse(authEntity: UserEntity, created: boolean): ISuccessfulResponse<void> {
		const token: string = Session.create({
			type: "user",
			properties: this.authTokenService.createAuthPayload(authEntity),
			options: this.authTokenService.createTokenProps(authEntity),
		});

		const redirectUrl: string = this.prepareAuthRedirectionUrl(token, created).toString();

		return this.responseHandler.createSuccessfulResponse<void>(void 0, HttpStatusCode.Found, {
			location: redirectUrl,
		});
	}

	private prepareAuthRedirectionUrl(token: string, created: boolean): URL {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const redirectUrl: URL = new URL(authConfig.redirectUrl);
		redirectUrl.searchParams.set("token", token);
		redirectUrl.searchParams.set("created", created.toString());

		return redirectUrl;
	}
}
