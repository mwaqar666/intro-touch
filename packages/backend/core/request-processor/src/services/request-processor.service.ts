import { RouterTokenConst } from "@/backend-core/router/const";
import type { IResolvedRoute, IRouteRegister } from "@/backend-core/router/interface";
import type { ApiRequest, ApiResponse, Nullable } from "@/stacks/types";
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
		const matchedRoute: IResolvedRoute = this.routeRegister.resolveRoute(apiRequest);

		const request: IRequest = this.prepareRequestObject(apiRequest, matchedRoute);
		const response: IResponse = await matchedRoute.handler(request, context);
		return this.prepareResponseObject(response);
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
