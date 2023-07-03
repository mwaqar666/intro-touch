import { Exception } from "@/backend-core/request-processor/exceptions";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IAppException, IError, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class ResponseHandlerService implements IResponseHandler {
	public handleException(exception: unknown): IFailedResponse<IError> {
		if (exception instanceof Exception) {
			const { message, code, context }: IAppException = exception.toError();
			return this.createFailedResponse(
				{
					message,
					context,
				},
				code,
			);
		}

		return this.createFailedResponse(
			{
				message: (<Error>exception).message,
				context: null,
			},
			500,
		);
	}

	public createSuccessfulResponse<T>(data: T): ISuccessfulResponse<T>;
	public createSuccessfulResponse<T>(data: T, code: number): ISuccessfulResponse<T>;
	public createSuccessfulResponse<T>(data: T, code = 200): ISuccessfulResponse<T> {
		return {
			body: {
				data: data,
				errors: null,
			},
			statusCode: code,
		};
	}

	public createFailedResponse<T extends IError>(data: T): IFailedResponse<T>;
	public createFailedResponse<T extends IError>(data: T, code: number): IFailedResponse<T>;
	public createFailedResponse<T extends IError>(data: T, code = 500): IFailedResponse<T> {
		return {
			body: {
				data: null,
				errors: data,
			},
			statusCode: code,
		};
	}
}
