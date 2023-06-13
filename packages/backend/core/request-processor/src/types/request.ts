import type { IPathParams, IQueryParams, IRouteParams } from "@/backend-core/router/interface";
import type { ApiRequest, Nullable } from "@/stacks/types";

export interface IRequestBody<T> {
	body: Nullable<T>;
}

export type IAppRequest<T, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> = Omit<ApiRequest, "body"> & IRequestBody<T> & IRouteParams<P, Q>;

export type IControllerRequest<T = unknown> = IAppRequest<T>;
