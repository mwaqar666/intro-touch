import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { IGuardResolver } from "@/backend-core/authentication/interface";
import type { IResolvedRoute } from "@/backend-core/router/interface";
import type { ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IHandlerMetaResolver, IInterceptorResolver, IRequestHandler, IRequestProcessor, IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IAppRequest, IErrorResponseBody, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(AuthenticationTokenConst.GuardResolverToken) private readonly guardResolver: IGuardResolver,
		@Inject(RequestProcessorTokenConst.RequestHandlerToken) private readonly requestHandler: IRequestHandler,
		@Inject(RequestProcessorTokenConst.ResponseHandlerToken) private readonly responseHandler: IResponseHandler,
		@Inject(RequestProcessorTokenConst.InterceptorResolverToken) private readonly interceptorResolver: IInterceptorResolver,
		@Inject(RequestProcessorTokenConst.HandlerMetaResolverToken) private readonly handlerMetaResolver: IHandlerMetaResolver,
	) {}

	public async processRequest(): Promise<ApiResponse>;
	public async processRequest(request: IAppRequest, context: Context): Promise<ApiResponse>;
	public async processRequest(request?: IAppRequest, context?: Context): Promise<ApiResponse> {
		try {
			request ??= this.requestHandler.getRequest();
			context ??= this.requestHandler.getContext();

			const route: IResolvedRoute = this.requestHandler.getRoute();

			await this.guardResolver.runRouteGuards(request, context, route.guards);

			request = await this.interceptorResolver.runRequestInterceptors(request, context, route.requestInterceptors);

			let response: ISuccessfulResponse<unknown> = await this.runRouteHandler(route, request, context);

			response = await this.interceptorResolver.runResponseInterceptors(request, response, context, route.responseInterceptors);

			return this.responseHandler.finalizeResponse(response);
		} catch (exception) {
			const response: IFailedResponse<IErrorResponseBody> = this.responseHandler.handleException(exception);

			return this.responseHandler.finalizeResponse(response);
		}
	}

	private async runRouteHandler(matchedRoute: IResolvedRoute, request: IAppRequest, context: Context): Promise<ISuccessfulResponse<unknown>> {
		const handlerParams: Array<unknown> = await this.handlerMetaResolver.resolveHandlerMeta(request, context, matchedRoute);

		const handlerResponse: unknown = await matchedRoute.handler(...handlerParams);

		return this.responseHandler.handleResponse(handlerResponse);
	}
}
