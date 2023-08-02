import type { ApiResponse, Nullable } from "@/stacks/types";

export interface IResponseBody<T> {
	body: T;
}

export interface IResponseStatusCode {
	statusCode: number;
}

export interface IResponse<T = unknown> extends Omit<ApiResponse, "body" | "statusCode">, IResponseBody<T>, IResponseStatusCode {}

export interface ISuccessResponseBody<T> {
	data: T;
	errors: null;
}

export interface IFailResponseBody<E> {
	data: null;
	errors: E;
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

export type ISuccessfulResponse<T> = IResponse<ISuccessResponseBody<T>>;
export type IFailedResponse<E extends IErrorResponseBody> = IResponse<IFailResponseBody<E>>;

export type IAppResponse<R = unknown, E extends IErrorResponseBody = IErrorResponseBody> = ISuccessfulResponse<R> | IFailedResponse<E>;
