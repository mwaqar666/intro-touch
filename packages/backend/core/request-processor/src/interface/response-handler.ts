import type { IError, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export interface IResponseHandler {
	handleException(exception: unknown): IFailedResponse<IError>;

	sendResponse<T>(data: T): ISuccessfulResponse<T>;

	sendResponse<T>(data: T, code: number): ISuccessfulResponse<T>;

	sendFailedResponse<T extends IError>(data: T): IFailedResponse<T>;

	sendFailedResponse<T extends IError>(data: T, code: number): IFailedResponse<T>;
}
