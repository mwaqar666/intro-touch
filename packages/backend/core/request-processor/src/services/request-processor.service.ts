import { RouterTokenConst } from "@/backend-core/router/const";
import type { IResolvedRoute, IRouteRegister } from "@/backend-core/router/interface";
import type { ApiRequest, ApiResponse, Nullable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestProcessor, IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
		@Inject(RequestProcessorTokenConst.ResponseHandler) private readonly responseHandler: IResponseHandler,
	) {}

	public async processRequest(apiRequest: ApiRequest, context: Context): Promise<ApiResponse> {
		const matchedRoute: IResolvedRoute = this.routeRegister.resolveRoute(apiRequest);

		const request: IControllerRequest = this.prepareRequestObject(apiRequest, matchedRoute);

		try {
			const response: IControllerResponse = await matchedRoute.handler(request, context);

			return this.prepareResponseObject(response);
		} catch (exception) {
			const response: IControllerResponse = this.responseHandler.handleException(exception);

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
