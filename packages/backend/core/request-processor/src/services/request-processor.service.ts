import type { UserEntity } from "@/backend/user/db/entities";
import { AuthTokenConst } from "@/backend-core/authentication/const";
import type { AuthRequestService } from "@/backend-core/authentication/services";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IResolvedRoute, IRouteRegister } from "@/backend-core/router/interface";
import type { ApiRequest, ApiResponse, Nullable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { ResponseHandler } from "@/backend-core/request-processor/extensions";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { IControllerAuthRequest, IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
		@Inject(AuthTokenConst.AuthRequestServiceToken) private readonly authRequestService: AuthRequestService,
	) {}

	public async processRequest(apiRequest: ApiRequest, context: Context): Promise<ApiResponse> {
		try {
			const matchedRoute: IResolvedRoute = this.routeRegister.resolveRoute(apiRequest);

			let request: IControllerRequest | IControllerAuthRequest<UserEntity> = this.prepareRequestObject(apiRequest, matchedRoute);

			request = await this.authRequestService.authenticateRequestIfApplicable(request, context, matchedRoute.authorizer);

			const response: IControllerResponse = await matchedRoute.handler(request, context);

			return this.prepareResponseObject(response);
		} catch (exception) {
			const response: IControllerResponse = ResponseHandler.handleException(exception);

			return this.prepareResponseObject(response);
		}
	}

	private prepareRequestObject(request: ApiRequest, matchedRoute: IResolvedRoute): IControllerRequest {
		const requestBody: Nullable<unknown> = request.body ? JSON.parse(request.body) : null;

		return {
			...request,
			pathParams: matchedRoute.pathParams,
			queryParams: matchedRoute.queryParams,
			body: requestBody,
		};
	}

	private prepareResponseObject(response: IControllerResponse): ApiResponse {
		return {
			...response,
			body: JSON.stringify(response.body),
		};
	}
}
