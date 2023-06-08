import { RouterTokenConst } from "@/backend-core/router/const";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { IResolvedRoute, IRouteRegister } from "@/backend-core/router/interface";
import type { ApiRequest, ApiResponse, Nullable, Optional } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { IRequest, IResponse } from "@/backend-core/request-processor/types";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
	) {}

	public async processRequest(apiRequest: ApiRequest, context: Context): Promise<ApiResponse> {
		const preFlightResponse: Optional<ApiResponse> = this.checkForPreFlightRequest(apiRequest.requestContext.http.method);
		if (preFlightResponse) return preFlightResponse;

		const { path, method } = apiRequest.requestContext.http;
		const matchedRoute: IResolvedRoute = this.routeRegister.resolveRoute(path, <RouteMethod>method);

		const request: IRequest = this.prepareRequestObject(apiRequest, matchedRoute);
		const response: IResponse = await matchedRoute.handler(request, context);
		return this.prepareResponseObject(response);
	}

	private checkForPreFlightRequest(method: string): Optional<ApiResponse> {
		const isPreflightRequest: boolean = method === "OPTIONS";

		if (!isPreflightRequest) return;

		return { statusCode: 200 };
	}

	private prepareRequestObject(request: ApiRequest, matchedRoute: IResolvedRoute): IRequest {
		const requestBody: Nullable<unknown> = request.body ? JSON.parse(request.body) : null;

		return {
			...request,
			routeParams: matchedRoute.routeParams,
			queryParams: matchedRoute.queryParams,
			body: requestBody,
		};
	}

	private prepareResponseObject(response: IResponse): ApiResponse {
		return {
			...response,
			body: JSON.stringify(response.body),
		};
	}
}
