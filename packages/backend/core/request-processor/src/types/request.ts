import type { IAuthParams } from "@/backend-core/authentication/types";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IPathParams, IQueryParams, IRouteParams } from "@/backend-core/router/interface";
import type { ApiRequest, Nullable } from "@/stacks/types";

export interface IRequestBody<T> {
	body: Nullable<T>;
}

export interface IAppRequest<T, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> extends Omit<ApiRequest, "body">, IRequestBody<T>, IRouteParams<P, Q> {}

export type IControllerRequest<T = unknown, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> = IAppRequest<T, P, Q>;

export interface IControllerAuthRequest<E extends BaseEntity<E> = any, T = unknown, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> extends IControllerRequest<T, P, Q>, IAuthParams<E> {}
