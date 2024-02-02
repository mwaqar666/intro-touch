import type { ApiResponse } from "@/stacks/types";
import type { HttpStatusCode } from "@/backend-core/request-processor/enums";
import type { IAppResponse, IErrorResponseBody, IFailedResponse, IHeaders, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IResponseHandler {
	handleException(exception: unknown): IFailedResponse<IErrorResponseBody>;

	handleResponse<T>(response: unknown): ISuccessfulResponse<T>;

	createSuccessfulResponse<T>(data: T): ISuccessfulResponse<T>;

	createSuccessfulResponse<T>(data: T, statusCode: HttpStatusCode): ISuccessfulResponse<T>;

	createSuccessfulResponse<T>(data: T, statusCode: HttpStatusCode, headers: IHeaders): ISuccessfulResponse<T>;

	createFailedResponse<E extends IErrorResponseBody>(error: E): IFailedResponse<E>;

	createFailedResponse<E extends IErrorResponseBody>(error: E, statusCode: HttpStatusCode): IFailedResponse<E>;

	createFailedResponse<E extends IErrorResponseBody>(error: E, statusCode: HttpStatusCode, headers: IHeaders): IFailedResponse<E>;

	finalizeResponse(response: IAppResponse): ApiResponse;
}
