import type { UserEntity } from "@/backend/user/db/entities";
import type { IRequestInterceptor } from "@/backend-core/request-processor/interface";
import type { IControllerAuthRequest, IControllerRequest } from "@/backend-core/request-processor/types";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { AuthTokenConst } from "@/backend-core/authentication/const";

export class AuthRequestService {
	public constructor(
		// Dependencies
		@Inject(AuthTokenConst.AuthRequestInterceptorToken) private readonly authRequestInterceptor: IRequestInterceptor<IControllerAuthRequest<UserEntity>>,
	) {}

	public async authenticateRequestIfApplicable(request: IControllerRequest, context: Context, authorizer?: AvailableAuthorizers): Promise<IControllerRequest | IControllerAuthRequest<UserEntity>> {
		if (!authorizer || authorizer === "none") return request;

		return this.authRequestInterceptor.intercept(request, context);
	}
}
