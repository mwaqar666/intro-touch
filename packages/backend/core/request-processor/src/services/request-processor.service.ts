import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { IGuardResolver } from "@/backend-core/authentication/interface";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IResolvedRoute, IRouteRegister } from "@/backend-core/router/interface";
import type { ApiRequest, ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { Exception } from "@/backend-core/request-processor/exceptions";
import type { IHandlerMetaResolver, IInterceptorResolver, IRequestProcessor, IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IAppRequest, IAppResponse, IErrorResponseBody, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
		@Inject(AuthenticationTokenConst.GuardResolverToken) private readonly guardResolver: IGuardResolver,
		@Inject(RequestProcessorTokenConst.ResponseHandlerToken) private readonly responseHandler: IResponseHandler,
		@Inject(RequestProcessorTokenConst.InterceptorResolverToken) private readonly interceptorResolver: IInterceptorResolver,
		@Inject(RequestProcessorTokenConst.HandlerMetaResolverToken) private readonly handlerMetaResolver: IHandlerMetaResolver,
	) {}

	public async processRequest(apiRequest: ApiRequest, context: Context): Promise<ApiResponse> {
		try {
			const matchedRoute: IResolvedRoute = this.routeRegister.resolveRoute(apiRequest);

			let request: IAppRequest = this.prepareRequestObject(apiRequest, matchedRoute);

			await this.guardResolver.runRouteGuards(request, context, matchedRoute.guards);

			request = await this.interceptorResolver.runRouteRequestInterceptors(request, context, matchedRoute.requestInterceptors);

			let response: ISuccessfulResponse<unknown> = await this.runRouteHandler(matchedRoute, request, context);

			response = await this.interceptorResolver.runRouteResponseInterceptors(request, response, context, matchedRoute.responseInterceptors);

			return this.prepareResponseObject(response);
		} catch (exception) {
			const response: IFailedResponse<IErrorResponseBody> = this.responseHandler.handleException(exception);

			return this.prepareResponseObject(response);
		}
	}

	private prepareRequestObject(request: ApiRequest, matchedRoute: IResolvedRoute): IAppRequest {
		const requestBody: object = request.body ? JSON.parse(request.body) : {};

		return {
			...request,
			pathParams: matchedRoute.pathParams,
			queryParams: matchedRoute.queryParams,
			body: requestBody,
		};
	}

	private async runRouteHandler(matchedRoute: IResolvedRoute, request: IAppRequest, context: Context): Promise<ISuccessfulResponse<unknown>> {
		const handlerParams: Array<any> = await this.handlerMetaResolver.resolveHandlerMeta(request, context, matchedRoute);

		const handlerResponse: unknown = await matchedRoute.handler(...handlerParams);

		return this.handleHandlerResponse(handlerResponse);
	}

	private prepareResponseObject(response: IAppResponse): ApiResponse {
		return {
			...response,
			body: JSON.stringify(response.body),
		};
	}

	private handleHandlerResponse(response: unknown): ISuccessfulResponse<unknown> {
		if (this.responseHandler.isFailedResponse(response)) {
			throw new Exception(response.body.errors.message, response.statusCode, response.body.errors.context);
		}

		if (this.responseHandler.isSuccessfulResponse(response)) {
			return response;
		}

		if (this.responseHandler.isRedirectionResponse(response)) {
			return {
				...response,
				body: {
					data: {},
					errors: null,
				},
			};
		}

		return this.responseHandler.createSuccessfulResponse(response);
	}
}
