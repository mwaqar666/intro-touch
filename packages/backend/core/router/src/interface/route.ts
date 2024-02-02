import type { IGuard } from "@/backend-core/authentication/interface";
import type { IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { Constructable, Delegate, ExclusiveUnion, Optional, PossiblePromise } from "@/stacks/types";
import type { RouteMethod, RouteType } from "@/backend-core/router/enum";

export interface IGroupedRoute {
	/**
	 * Prefix to add to a group of routes
	 */
	prefix: string;

	/**
	 * Routes that fall under this group's prefix
	 */
	routes: Array<IRoute>;

	/**
	 * Guards to apply to this group of routes
	 */
	guards?: Array<Constructable<IGuard, Array<any>>>;

	/**
	 * Route type, this denotes where this route will be registered. Default is RouteType.GLOBAL
	 */
	routeType?: RouteType;

	/**
	 * Request interceptors to apply to this group of routes
	 */
	requestInterceptors?: Array<Constructable<IRequestInterceptor, Array<any>>>;

	/**
	 * Response interceptors to apply to this group of routes
	 */
	responseInterceptors?: Array<Constructable<IResponseInterceptor, Array<any>>>;
}

export interface ISimpleRoute {
	/**
	 * Route path
	 */
	path: string;

	/**
	 * Route HTTP method
	 */
	method: RouteMethod;

	/**
	 * Route handler that will be called when this route is invoked
	 */
	handler: Delegate<Array<any>, PossiblePromise<unknown>>;

	/**
	 * Guards to apply to this route
	 */
	guards?: Array<Constructable<IGuard, Array<any>>>;

	/**
	 * Route type, this denotes where this route will be registered. Default is RouteType.GLOBAL
	 */
	routeType?: RouteType;

	/**
	 * Request interceptors to apply to this route
	 */
	requestInterceptors?: Array<Constructable<IRequestInterceptor, Array<any>>>;

	/**
	 * Response interceptors to apply to this route
	 */
	responseInterceptors?: Array<Constructable<IResponseInterceptor, Array<any>>>;
}

export interface IStackRoute {
	path: string;
	method: RouteMethod;
}

export type IBuiltRoute = Required<ISimpleRoute>;

export type IBuiltGroupRoute = Required<Omit<IGroupedRoute, "routes">>;

export type IRoute = ExclusiveUnion<[ISimpleRoute, IGroupedRoute]>;

export interface IPathParams {
	[p: string]: string;
}

export interface IQueryParams {
	[p: string]: Optional<string>;
}

export interface IRouteParams<P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> {
	pathParams: P;
	queryParams: Q;
}

export interface IResolvedRoute<P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> extends IBuiltRoute, IRouteParams<P, Q> {}

export interface IRouter {
	registerRoutes(): Array<IRoute>;
}
