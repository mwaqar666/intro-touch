import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface/interceptor";
import type { IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IInterceptorResolver {
	runRouteRequestInterceptors(request: IControllerRequest, context: Context, interceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<IControllerRequest>;

	runRouteResponseInterceptors(request: IControllerRequest, response: ISuccessfulResponse<unknown>, context: Context, interceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<ISuccessfulResponse<unknown>>;
}
