import type { Nullable } from "@/stacks/types";
import type { HttpStatusCode } from "@/backend-core/request-processor/enums";

export interface ISuccessfulResponse<T> {
	data: T;
	error: null;
}

export interface IFailedResponse<C> {
	data: null;
	error: IError<C>;
}

export type IHeaders = Record<string, string | number | boolean>;

export interface IError<C> {
	message: string;
	context: Nullable<C>;
}

export interface IAppException<C> extends IError<C> {
	code: HttpStatusCode;
}
