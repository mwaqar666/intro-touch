import type { IError, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IResponseHandler {
	handleException(exception: unknown): IFailedResponse<IError>;

	createSuccessfulResponse<T>(data: T): ISuccessfulResponse<T>;

	createSuccessfulResponse<T>(data: T, code: number): ISuccessfulResponse<T>;

	createFailedResponse<T extends IError>(data: T): IFailedResponse<T>;

	createFailedResponse<T extends IError>(data: T, code: number): IFailedResponse<T>;
}
