import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface/interceptor";
import type { IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export interface IInterceptorResolver {
	runRouteRequestInterceptors(request: IControllerRequest, context: Context, requestInterceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<IControllerRequest>;

	runRouteResponseInterceptors(response: IControllerResponse, context: Context, responseInterceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<IControllerResponse>;
}
