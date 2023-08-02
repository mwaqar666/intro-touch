import type { IAuthParams } from "@/backend-core/authentication/types";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IPathParams, IQueryParams, IRouteParams } from "@/backend-core/router/interface";
import type { ApiRequest } from "@/stacks/types";

export interface IRequestBody<T> {
	body: T;
}

export interface IAppRequest<T = object, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> extends Omit<ApiRequest, "body">, IRequestBody<T>, IRouteParams<P, Q> {}

export interface IAuthAppRequest<E extends BaseEntity<E> = any, T = object, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> extends IAppRequest<T, P, Q>, IAuthParams<E> {}
