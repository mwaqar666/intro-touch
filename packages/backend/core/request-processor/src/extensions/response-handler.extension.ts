import { Exception } from "@/backend-core/request-processor/exceptions";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IAppException, IError, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class ResponseHandlerExtension implements IResponseHandler {
	public handleException(exception: unknown): IFailedResponse<IError> {
		if (exception instanceof Exception) {
			const { message, code }: IAppException = exception.toError();
			return this.sendFailedResponse(
				{
					message,
				},
				code,
			);
		}

		const error: IError = {
			message: (<Error>exception).message,
		};

		return this.sendFailedResponse(error, 500);
	}

	public sendResponse<T>(data: T): ISuccessfulResponse<T>;
	public sendResponse<T>(data: T, code: number): ISuccessfulResponse<T>;
	public sendResponse<T>(data: T, code = 200): ISuccessfulResponse<T> {
		return {
			body: {
				data: data,
				errors: null,
			},
			statusCode: code,
		};
	}

	public sendFailedResponse<T extends IError>(data: T): IFailedResponse<T>;
	public sendFailedResponse<T extends IError>(data: T, code: number): IFailedResponse<T>;
	public sendFailedResponse<T extends IError>(data: T, code = 500): IFailedResponse<T> {
		return {
			body: {
				data: null,
				errors: data,
			},
			statusCode: code,
		};
	}
}
