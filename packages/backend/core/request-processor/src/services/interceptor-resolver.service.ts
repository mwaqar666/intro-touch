import { AppContainer } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IInterceptorResolver, IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export class InterceptorResolverService implements IInterceptorResolver {
	public async runRouteRequestInterceptors(request: IControllerRequest, context: Context, requestInterceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<IControllerRequest> {
		for (const requestInterceptor of requestInterceptors) {
			const resolvedRequestInterceptor: IRequestInterceptor = AppContainer.resolve(requestInterceptor);

			request = await resolvedRequestInterceptor.intercept(request, context);
		}

		return request;
	}

	public async runRouteResponseInterceptors(response: IControllerResponse, context: Context, responseInterceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<IControllerResponse> {
		for (const responseInterceptor of responseInterceptors) {
			const resolvedResponseInterceptor: IResponseInterceptor = AppContainer.resolve(responseInterceptor);

			response = await resolvedResponseInterceptor.intercept(response, context);
		}

		return response;
	}
}
