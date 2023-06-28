import { AuthTokenConst } from "@/backend-core/authentication/const";
import type { IGuardResolver } from "@/backend-core/authentication/interface";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IResolvedRoute, IRouteRegister } from "@/backend-core/router/interface";
import type { ApiRequest, ApiResponse, Nullable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { ResponseHandler } from "@/backend-core/request-processor/extensions";
import type { IInterceptorResolver, IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
		@Inject(AuthTokenConst.GuardResolverToken) private readonly guardResolver: IGuardResolver,
		@Inject(RequestProcessorTokenConst.InterceptorResolverToken) private readonly interceptorResolver: IInterceptorResolver,
	) {}

	public async processRequest(apiRequest: ApiRequest, context: Context): Promise<ApiResponse> {
		try {
			const matchedRoute: IResolvedRoute = this.routeRegister.resolveRoute(apiRequest);

			let request: IControllerRequest = this.prepareRequestObject(apiRequest, matchedRoute);

			await this.guardResolver.runRouteGuards(request, context, matchedRoute.guards);

			request = await this.interceptorResolver.runRouteRequestInterceptors(request, context, matchedRoute.requestInterceptors);

			let response: IControllerResponse = await matchedRoute.handler(request, context);

			response = await this.interceptorResolver.runRouteResponseInterceptors(response, context, matchedRoute.responseInterceptors);

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
