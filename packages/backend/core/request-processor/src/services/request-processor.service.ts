import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { IGuardResolver } from "@/backend-core/authentication/interface";
import { App } from "@/backend-core/core/extensions";
import type { IResolvedRoute } from "@/backend-core/router/interface";
import type { ApiResponse } from "@/stacks/types";
import { Inject } from "iocc";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { Request, Response } from "@/backend-core/request-processor/handlers";
import type { IHandlerMetaResolver, IInterceptorResolver, IRequestProcessor } from "@/backend-core/request-processor/interface";

export class RequestProcessorService implements IRequestProcessor {
	public constructor(
		// Dependencies
		@Inject(AuthenticationTokenConst.GuardResolverToken) private readonly guardResolver: IGuardResolver,
		@Inject(RequestProcessorTokenConst.InterceptorResolverToken) private readonly interceptorResolver: IInterceptorResolver,
		@Inject(RequestProcessorTokenConst.HandlerMetaResolverToken) private readonly handlerMetaResolver: IHandlerMetaResolver,
	) {}

	public async processRequest(): Promise<ApiResponse>;
	public async processRequest(request: Request): Promise<ApiResponse>;
	public async processRequest(request?: Request): Promise<ApiResponse> {
		try {
			request ??= App.container.resolve(Request);

			const route: IResolvedRoute = request.route();

			await this.guardResolver.runRouteGuards(request, route.guards);

			request = await this.interceptorResolver.runRequestInterceptors(request, route.requestInterceptors);

			let response: Response = await this.runRouteHandler(route, request);

			response = await this.interceptorResolver.runResponseInterceptors(request, response, route.responseInterceptors);

			return response.send();
		} catch (exception) {
			const response: Response = App.container.resolve(Response);

			return response.handle(exception).send();
		}
	}

	private async runRouteHandler(matchedRoute: IResolvedRoute, request: Request): Promise<Response> {
		const handlerParams: Array<unknown> = await this.handlerMetaResolver.resolveHandlerMeta(request, matchedRoute);

		const response: Response = App.container.resolve(Response);

		return response.handle(await matchedRoute.handler(...handlerParams));
	}
}
