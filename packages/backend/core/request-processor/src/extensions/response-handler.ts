import { AppContainer } from "@/backend-core/core/extensions";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IError, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class ResponseHandler {
	public static handleException(exception: unknown): IFailedResponse<IError> {
		const responseHandler: IResponseHandler = AppContainer.resolve(RequestProcessorTokenConst.ResponseHandlerToken);

		return responseHandler.handleException(exception);
	}

	public static sendResponse<T>(data: T): ISuccessfulResponse<T>;
	public static sendResponse<T>(data: T, code: number): ISuccessfulResponse<T>;
	public static sendResponse<T>(data: T, code = 200): ISuccessfulResponse<T> {
		const responseHandler: IResponseHandler = AppContainer.resolve(RequestProcessorTokenConst.ResponseHandlerToken);

		return responseHandler.sendResponse(data, code);
	}

	public static sendFailedResponse<T extends IError>(data: T): IFailedResponse<T>;
	public static sendFailedResponse<T extends IError>(data: T, code: number): IFailedResponse<T>;
	public static sendFailedResponse<T extends IError>(data: T, code = 500): IFailedResponse<T> {
		const responseHandler: IResponseHandler = AppContainer.resolve(RequestProcessorTokenConst.ResponseHandlerToken);

		return responseHandler.sendFailedResponse(data, code);
	}
}
