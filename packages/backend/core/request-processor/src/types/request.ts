import type { IParams, IRouteParams } from "@/backend-core/router/interface";
import type { ApiRequest, Nullable } from "@/stacks/types";

export interface IRequestBody<T> {
	body: Nullable<T>;
}

export type IRequest<T = unknown, P extends IParams = IParams, Q extends IParams = IParams> = Omit<ApiRequest, "body"> & IRequestBody<T> & IRouteParams<P, Q>;
