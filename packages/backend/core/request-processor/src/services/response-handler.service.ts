import type { ApiResponse, DeepPartial } from "@/stacks/types";
import { HttpStatusCode } from "@/backend-core/request-processor/enums";
import { Exception } from "@/backend-core/request-processor/exceptions";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IAppException, IAppResponse, IErrorResponseBody, IFailedResponse, IFailedResponseBody, IHeaders, ISuccessfulResponse, ISuccessfulResponseBody } from "@/backend-core/request-processor/types";

export class ResponseHandlerService implements IResponseHandler {
	public handleException(exception: unknown): IFailedResponse<IErrorResponseBody> {
		if (exception instanceof Exception) {
			const { message, code, context }: IAppException = exception.toError();

			return this.createFailedResponse({ message, context }, code);
		}

		const message: string = (exception as Error).message ?? "Something went wrong! Please try again!";

		return this.createFailedResponse({ message, context: null }, HttpStatusCode.InternalServerError);
	}

	public handleResponse<T>(response: unknown): ISuccessfulResponse<T> {
		if (this.isSuccessfulHandlerResponse<T>(response)) return response;

		if (this.isFailedHandlerResponse(response)) {
			const { body, statusCode }: IFailedResponse<IErrorResponseBody> = response;

			throw new Exception(body.error.message, statusCode, body.error.context);
		}

		return this.createSuccessfulResponse<T>(response as T);
	}

	public createSuccessfulResponse<T>(data: T): ISuccessfulResponse<T>;
	public createSuccessfulResponse<T>(data: T, statusCode: HttpStatusCode): ISuccessfulResponse<T>;
	public createSuccessfulResponse<T>(data: T, statusCode: HttpStatusCode, headers: IHeaders): ISuccessfulResponse<T>;
	public createSuccessfulResponse<T>(data: T, statusCode: HttpStatusCode = HttpStatusCode.Ok, headers: IHeaders = {}): ISuccessfulResponse<T> {
		const body: ISuccessfulResponseBody<T> = { data, error: null };

		return { body, statusCode, headers };
	}

	public createFailedResponse<E extends IErrorResponseBody>(error: E): IFailedResponse<E>;
	public createFailedResponse<E extends IErrorResponseBody>(error: E, statusCode: HttpStatusCode): IFailedResponse<E>;
	public createFailedResponse<E extends IErrorResponseBody>(error: E, statusCode: HttpStatusCode, headers: IHeaders): IFailedResponse<E>;
	public createFailedResponse<E extends IErrorResponseBody>(error: E, statusCode: HttpStatusCode = HttpStatusCode.InternalServerError, headers: IHeaders = {}): IFailedResponse<E> {
		const body: IFailedResponseBody<E> = { data: null, error };

		return { body, statusCode, headers };
	}

	public finalizeResponse(response: IAppResponse): ApiResponse {
		return {
			...response,
			body: JSON.stringify(response.body),
		};
	}

	private isFailedHandlerResponse(response: unknown): response is IFailedResponse<IErrorResponseBody> {
		if (response === undefined || response === null) return false;

		const responseToInspect: DeepPartial<IFailedResponse<IErrorResponseBody>> = response;

		const isFailedStatusCode: boolean = !!responseToInspect.statusCode && responseToInspect.statusCode >= 400 && responseToInspect.statusCode < 600;

		return isFailedStatusCode && !!responseToInspect.body && !!responseToInspect.body.error && "message" in responseToInspect.body.error && responseToInspect.body.data === null;
	}

	private isSuccessfulHandlerResponse<T>(response: unknown): response is ISuccessfulResponse<T> {
		if (response === undefined || response === null) return false;

		const responseToInspect: DeepPartial<ISuccessfulResponse<T>> = response;

		const isSuccessfulStatusCode: boolean = !!responseToInspect.statusCode && responseToInspect.statusCode >= 200 && responseToInspect.statusCode < 400;

		return isSuccessfulStatusCode && !!responseToInspect.body && "data" in responseToInspect.body && responseToInspect.body.error === null;
	}
}
