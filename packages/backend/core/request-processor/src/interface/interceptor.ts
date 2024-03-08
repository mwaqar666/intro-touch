import type { PossiblePromise } from "@/stacks/types";
import type { Request, Response } from "@/backend-core/request-processor/handlers";

export interface IRequestInterceptor<TRequest extends Request = Request, TRequestIntercepted extends Request = Request> {
	intercept(request: TRequest): PossiblePromise<TRequestIntercepted>;
}

export interface IResponseInterceptor<TRequest extends Request = Request, TResponse extends Response = Response, TResponseIntercepted extends Response = Response> {
	intercept(request: TRequest, response: TResponse): PossiblePromise<TResponseIntercepted>;
}
