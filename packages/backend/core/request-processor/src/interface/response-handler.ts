import type { ApiResponse } from "@/stacks/types";
import type { IAppResponse, IErrorResponseBody, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IResponseHandler {
	handleException(exception: unknown): IFailedResponse<IErrorResponseBody>;

	createSuccessfulResponse<T>(data: T): ISuccessfulResponse<T>;

	createSuccessfulResponse<T>(data: T, code: number): ISuccessfulResponse<T>;

	createFailedResponse<T extends IErrorResponseBody>(data: T): IFailedResponse<T>;

	createFailedResponse<T extends IErrorResponseBody>(data: T, code: number): IFailedResponse<T>;

	handleHandlerResponse(response: unknown): ISuccessfulResponse<unknown>;

	finalizeResponse(response: IAppResponse): ApiResponse;
}
