import { App } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import type { Request, Response } from "@/backend-core/request-processor/handlers";
import type { IInterceptorResolver, IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface";

export class InterceptorResolverService implements IInterceptorResolver {
	public async runRequestInterceptors(request: Request, interceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<Request> {
		for (const interceptor of interceptors) {
			const requestInterceptor: IRequestInterceptor = App.container.resolve(interceptor);

			request = await requestInterceptor.intercept(request);
		}

		return request;
	}

	public async runResponseInterceptors(request: Request, response: Response, interceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<Response> {
		for (const interceptor of interceptors) {
			const responseInterceptor: IResponseInterceptor = App.container.resolve(interceptor);

			response = await responseInterceptor.intercept(request, response);
		}

		return response;
	}
}
