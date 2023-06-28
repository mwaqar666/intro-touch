import type { PossiblePromise } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export interface IRequestInterceptor<T extends IControllerRequest = IControllerRequest, R extends IControllerRequest = T> {
	intercept(request: T, context: Context): PossiblePromise<R>;
}

export interface IResponseInterceptor<T extends IControllerResponse = IControllerResponse, R extends IControllerResponse = T> {
	intercept(response: T, context: Context): PossiblePromise<R>;
}
