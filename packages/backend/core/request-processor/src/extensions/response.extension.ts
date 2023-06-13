import { Exception } from "@/backend-core/request-processor/exceptions";
import type { IAppException, IError, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class ResponseExtension {
	public static handleException(exception: unknown): IFailedResponse<IError> {
		if (exception instanceof Exception) {
			const { message, code }: IAppException = exception.toError();
			return ResponseExtension.sendFailedResponse(
				{
					message,
				},
				code,
			);
		}

		const error: IError = {
			message: (<Error>exception).message,
		};

		return ResponseExtension.sendFailedResponse(error, 500);
	}

	public static sendResponse<T>(data: T, code = 200): ISuccessfulResponse<T> {
		return {
			body: {
				data: data,
				errors: null,
			},
			statusCode: code,
		};
	}

	public static sendFailedResponse<T extends IError>(data: T, code = 500): IFailedResponse<T> {
		return {
			body: {
				data: null,
				errors: data,
			},
			statusCode: code,
		};
	}
}
