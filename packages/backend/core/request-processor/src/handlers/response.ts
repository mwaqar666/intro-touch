import type { ApiResponse, Nullable } from "@/stacks/types";
import { HttpStatusCode } from "@/backend-core/request-processor/enums";
import { Exception } from "@/backend-core/request-processor/exceptions";
import type { IAppException, IError, IFailedResponse, IHeaders, ISuccessfulResponse } from "@/backend-core/request-processor/types";

export class Response<T = unknown, C = unknown> {
	private _headers: IHeaders = {};
	private _data: Nullable<T> = null;
	private _error: Nullable<IError<C>> = null;
	private _statusCode: HttpStatusCode = HttpStatusCode.Ok;

	public constructor() {
		this.addHeaders({ "Content-Type": "application/json" });
	}

	public setHeaders(headers: IHeaders): Response<T, C> {
		this._headers = headers;

		return this;
	}

	public addHeaders(headers: IHeaders): Response<T, C> {
		this._headers = { ...this._headers, ...headers };

		return this;
	}

	public removeHeaders(...headers: Array<string>): Response<T, C> {
		headers.forEach((header: string): void => {
			delete this._headers[header];
		});

		return this;
	}

	public getHeaders(): IHeaders {
		return this._headers;
	}

	public setData(data: Nullable<T>): Response<T, C> {
		this._data = data;

		return this;
	}

	public getData(): Nullable<T> {
		return this._data;
	}

	public setError(error: Nullable<IError<C>>): Response<T, C> {
		this._error = error;

		return this;
	}

	public getError(): Nullable<IError<C>> {
		return this._error;
	}

	public setStatusCode(statusCode: HttpStatusCode): Response<T, C> {
		this._statusCode = statusCode;

		return this;
	}

	public getStatusCode(): HttpStatusCode {
		return this._statusCode;
	}

	public handle(response: unknown): Response<T, C> {
		if (response instanceof Response) return response;

		if (response instanceof Exception) {
			this.handleApplicationException(response);

			return this;
		}

		if (response instanceof Error) {
			this.handleCoreException(response);

			return this;
		}

		this.handleData(response as T);

		return this;
	}

	public send(): ApiResponse {
		const [headers, statusCode]: [IHeaders, HttpStatusCode] = [this.getHeaders(), this.getStatusCode()];

		const response: ApiResponse = { headers, statusCode };

		return statusCode < HttpStatusCode.BadRequest ? this.prepareSuccessfulResponse(response) : this.prepareFailedResponse(response);
	}

	private handleApplicationException(exception: Exception<C>): void {
		const { message, context, code }: IAppException<C> = exception.toError();

		this.setData(null);
		this.setError({ message, context });
		this.setStatusCode(code);
	}

	private handleCoreException(exception: Error): void {
		this.setData(null);
		this.setError({ message: exception.message, context: null });
		this.setStatusCode(HttpStatusCode.InternalServerError);
	}

	private handleData(data: T): void {
		this.setData(data);
		this.setError(null);
	}

	private prepareSuccessfulResponse(response: ApiResponse): ApiResponse {
		const data: T = this.getData() as T;

		const successfulResponse: ISuccessfulResponse<T> = { data, error: null };

		response.body = JSON.stringify(successfulResponse);

		return response;
	}

	private prepareFailedResponse(response: ApiResponse): ApiResponse {
		const error: IError<C> = this.getError() as IError<C>;

		const failedResponse: IFailedResponse<C> = { data: null, error };

		response.body = JSON.stringify(failedResponse);

		return response;
	}
}
