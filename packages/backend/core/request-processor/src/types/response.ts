import type { ApiResponse, Nullable } from "@/stacks/types";

export interface IResponseBody<T> {
	body: Nullable<T>;
}

export type IAppResponse<T = unknown> = Omit<ApiResponse, "body"> & IResponseBody<T>;

export interface ISuccess<T> {
	data: T;
	errors: null;
}

export interface IFail<E> {
	data: null;
	errors: E;
}

export interface IError {
	/**
	 * Error message
	 */
	message: string;

	/**
	 * Error details
	 */
	context: Nullable<unknown>;
}

export type ISuccessfulResponse<T> = IAppResponse<ISuccess<T>>;
export type IFailedResponse<E extends IError> = IAppResponse<IFail<E>>;

export type IControllerResponse<R = unknown, E extends IError = IError> = ISuccessfulResponse<R> | IFailedResponse<E>;
