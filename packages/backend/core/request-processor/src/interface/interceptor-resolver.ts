import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface/interceptor";
import type { IAppRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IInterceptorResolver {
	runRequestInterceptors(request: IAppRequest, context: Context, interceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<IAppRequest>;

	runResponseInterceptors(request: IAppRequest, response: ISuccessfulResponse<unknown>, context: Context, interceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<ISuccessfulResponse<unknown>>;
}
