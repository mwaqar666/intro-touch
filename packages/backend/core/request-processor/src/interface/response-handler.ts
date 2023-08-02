import type { IErrorResponseBody, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IResponseHandler {
	handleException(exception: unknown): IFailedResponse<IErrorResponseBody>;

	createSuccessfulResponse<T>(data: T): ISuccessfulResponse<T>;

	createSuccessfulResponse<T>(data: T, code: number): ISuccessfulResponse<T>;

	createFailedResponse<T extends IErrorResponseBody>(data: T): IFailedResponse<T>;

	createFailedResponse<T extends IErrorResponseBody>(data: T, code: number): IFailedResponse<T>;

	isFailedResponse(response: unknown): response is IFailedResponse<IErrorResponseBody>;

	isSuccessfulResponse(response: unknown): response is ISuccessfulResponse<unknown>;

	isRedirectionResponse(response: unknown): response is ISuccessfulResponse<unknown>;
}
