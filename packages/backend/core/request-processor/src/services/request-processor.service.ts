import { RouterTokenConst } from "@/backend-core/router/const";
import type { IResolvedRoute, IRouteRegister } from "@/backend-core/router/interface";
import type { ApiRequest, ApiResponse, Nullable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { ResponseExtension } from "@/backend-core/request-processor/extensions";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
	) {}

	public async processRequest(apiRequest: ApiRequest, context: Context): Promise<ApiResponse> {
		const matchedRoute: IResolvedRoute = this.routeRegister.resolveRoute(apiRequest);

		const request: IControllerRequest = this.prepareRequestObject(apiRequest, matchedRoute);
		let response: IControllerResponse;

		try {
			response = await matchedRoute.handler(request, context);
		} catch (exception) {
			response = ResponseExtension.handleException(exception);
		}

		return this.prepareResponseObject(response);
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
