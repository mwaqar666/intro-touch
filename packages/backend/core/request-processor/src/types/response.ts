import type { ApiResponse, Nullable } from "@/stacks/types";
import type { HttpStatusCode } from "@/backend-core/request-processor/enums";

export interface IResponseBody<T> {
	body: T;
}

export interface IResponseHeaders {
	headers: IHeaders;
}

export interface IResponseStatusCode {
	statusCode: HttpStatusCode;
}

export interface IResponse<T = unknown> extends Omit<ApiResponse, "body" | "statusCode" | "headers">, IResponseHeaders, IResponseBody<T>, IResponseStatusCode {}

export interface ISuccessfulResponseBody<T> {
	data: T;
	error: null;
}

export interface IFailedResponseBody<E extends IErrorResponseBody> {
	data: null;
	error: E;
}

export interface IErrorResponseBody {
	/**
	 * Error message
	 */
	message: string;

	/**
	 * Error details
	 */
	context: Nullable<unknown>;
}

export type IHeaders = Record<string, string | number | boolean>;

export type ISuccessfulResponse<T> = IResponse<ISuccessfulResponseBody<T>>;
export type IFailedResponse<E extends IErrorResponseBody> = IResponse<IFailedResponseBody<E>>;

export type IAppResponse<T = unknown, E extends IErrorResponseBody = IErrorResponseBody> = ISuccessfulResponse<T> | IFailedResponse<E>;
