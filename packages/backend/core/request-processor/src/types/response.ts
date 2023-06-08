import type { ApiResponse, Nullable } from "@/stacks/types";

export interface IResponseBody<T> {
	body: Nullable<T>;
}

export type IResponse<T = unknown> = Omit<ApiResponse, "body"> & IResponseBody<T>;
