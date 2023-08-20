import type { ApiResponse, DeepPartial } from "@/stacks/types";
import { Exception } from "@/backend-core/request-processor/exceptions";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IAppException, IAppResponse, IErrorResponseBody, IFailedResponse, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class ResponseHandlerService implements IResponseHandler {
	public handleException(exception: unknown): IFailedResponse<IErrorResponseBody> {
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

	public createFailedResponse<T extends IErrorResponseBody>(data: T): IFailedResponse<T>;
	public createFailedResponse<T extends IErrorResponseBody>(data: T, code: number): IFailedResponse<T>;
	public createFailedResponse<T extends IErrorResponseBody>(data: T, code = 500): IFailedResponse<T> {
		return {
			body: {
				data: null,
				errors: data,
			},
			statusCode: code,
		};
	}

	public handleHandlerResponse(response: unknown): ISuccessfulResponse<unknown> {
		if (this.isFailedHandlerResponse(response)) {
			throw new Exception(response.body.errors.message, response.statusCode, response.body.errors.context);
		}

		if (this.isSuccessfulHandlerResponse(response)) {
			return response;
		}

		if (this.isRedirectHandlerResponse(response)) {
			return {
				...response,
				body: {
					data: {},
					errors: null,
				},
			};
		}

		return this.createSuccessfulResponse(response);
	}

	public finalizeResponse(response: IAppResponse): ApiResponse {
		return {
			...response,
			body: JSON.stringify(response.body),
		};
	}

	private isFailedHandlerResponse(response: unknown): response is IFailedResponse<IErrorResponseBody> {
		if (!response) return false;

		const responseToInspect: DeepPartial<ISuccessfulResponse<unknown>> = response;

		if (!responseToInspect.statusCode) return false;

		return !!responseToInspect.body && responseToInspect.body.errors !== null;
	}

	private isSuccessfulHandlerResponse(response: unknown): response is ISuccessfulResponse<unknown> {
		if (!response) return false;

		const responseToInspect: DeepPartial<ISuccessfulResponse<unknown>> = response;

		if (!responseToInspect.statusCode) return false;

		return !!responseToInspect.body && responseToInspect.body.data !== null;
	}

	private isRedirectHandlerResponse(response: unknown): response is ISuccessfulResponse<unknown> {
		if (!response) return false;

		const responseToInspect: DeepPartial<ISuccessfulResponse<unknown>> = response;

		if (!responseToInspect.statusCode || !responseToInspect.headers) return false;

		if (responseToInspect.statusCode < 300 || responseToInspect.statusCode > 399) return false;

		return !!responseToInspect.headers["location"];
	}
}
