import type { PossiblePromise } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IAppRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IRequestInterceptor<TRequest = object, TInterceptedRequest = TRequest> {
	intercept(request: IAppRequest<TRequest>, context: Context): PossiblePromise<IAppRequest<TInterceptedRequest>>;
}

export interface IResponseInterceptor<TRequest = object, TResponse = unknown, TInterceptedResponse = TResponse> {
	intercept(request: IAppRequest<TRequest>, response: ISuccessfulResponse<TResponse>, context: Context): PossiblePromise<ISuccessfulResponse<TInterceptedResponse>>;
}
