import type { Constructable } from "@/stacks/types";
import type { Request, Response } from "@/backend-core/request-processor/handlers";
import type { IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface/interceptor";

export interface IInterceptorResolver {
	runRequestInterceptors(request: Request, interceptors: Array<Constructable<IRequestInterceptor, Array<unknown>>>): Promise<Request>;

	runResponseInterceptors(request: Request, response: Response, interceptors: Array<Constructable<IResponseInterceptor, Array<unknown>>>): Promise<Response>;
}
