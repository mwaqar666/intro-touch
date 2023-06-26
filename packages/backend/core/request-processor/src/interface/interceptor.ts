import type { PossiblePromise } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IControllerRequest, IControllerResponse } from "@/backend-core/request-processor/types";

export interface IRequestInterceptor<R extends IControllerRequest = IControllerRequest> {
	intercept(request: IControllerRequest, context: Context): PossiblePromise<R>;
}

export interface IResponseInterceptor<R extends IControllerResponse = IControllerResponse> {
	intercept(response: IControllerResponse, context: Context): PossiblePromise<R>;
}
