import type { IRouteParams } from "@/backend-core/router/interface";
import type { ApiRequest, Nullable } from "@/stacks/types";

export interface IRequestBody<T> {
	body: Nullable<T>;
}

export type IRequest<T = unknown> = Omit<ApiRequest, "body"> & IRequestBody<T> & IRouteParams;
