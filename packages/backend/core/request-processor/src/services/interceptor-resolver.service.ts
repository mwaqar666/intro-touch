import { App } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IInterceptorResolver, IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { IAppRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class InterceptorResolverService implements IInterceptorResolver {
	public async runRequestInterceptors(request: IAppRequest, context: Context, interceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<IAppRequest> {
		for (const interceptor of interceptors) {
			const requestInterceptor: IRequestInterceptor = App.container.resolve(interceptor);

			request = await requestInterceptor.intercept(request, context);
		}

		return request;
	}

	public async runResponseInterceptors(request: IAppRequest, response: ISuccessfulResponse<unknown>, context: Context, interceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<ISuccessfulResponse<unknown>> {
		for (const interceptor of interceptors) {
			const responseInterceptor: IResponseInterceptor = App.container.resolve(interceptor);

			response = await responseInterceptor.intercept(request, response, context);
		}

		return response;
	}
}
