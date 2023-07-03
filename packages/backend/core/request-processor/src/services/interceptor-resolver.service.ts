import { AppContainer } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IInterceptorResolver, IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class InterceptorResolverService implements IInterceptorResolver {
	public async runRouteRequestInterceptors(request: IControllerRequest, context: Context, interceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<IControllerRequest> {
		for (const interceptor of interceptors) {
			const requestInterceptor: IRequestInterceptor = AppContainer.resolve(interceptor);

			request = await requestInterceptor.intercept(request, context);
		}

		return request;
	}

	public async runRouteResponseInterceptors(request: IControllerRequest, response: ISuccessfulResponse<unknown>, context: Context, interceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<ISuccessfulResponse<unknown>> {
		for (const interceptor of interceptors) {
			const responseInterceptor: IResponseInterceptor = AppContainer.resolve(interceptor);

			response = await responseInterceptor.intercept(request, response, context);
		}

		return response;
	}
}
