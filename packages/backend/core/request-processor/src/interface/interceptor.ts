import type { PossiblePromise } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IRequestInterceptor<TRequest = object, TInterceptedRequest = TRequest> {
	intercept(request: IControllerRequest<TRequest>, context: Context): PossiblePromise<IControllerRequest<TInterceptedRequest>>;
}

export interface IResponseInterceptor<TRequest = object, TResponse = unknown, TInterceptedResponse = TResponse> {
	intercept(request: IControllerRequest<TRequest>, response: ISuccessfulResponse<TResponse>, context: Context): PossiblePromise<ISuccessfulResponse<TInterceptedResponse>>;
}
