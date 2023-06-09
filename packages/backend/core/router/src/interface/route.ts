import type { IRequest, IResponse } from "@/backend-core/request-processor/types";
import type { AvailableAuthorizers, Delegate, ExclusiveUnion } from "@/stacks/types";
import type { Context } from "aws-lambda/handler";
import type { RouteMethod } from "@/backend-core/router/enum";

export interface IGroupedRoute {
	/**
	 * Prefix to add to a group of routes
	 */
	prefix: string;

	/**
	 * Routes that follows the above-mentioned prefix
	 */
	routes: Array<IRoute>;

	/**
	 * Authorizers to apply for this group of routes
	 */
	authorizer?: AvailableAuthorizers;
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
	 * Route handler that will be inside packages/backend
	 *
	 * Example:
	 * If the handler is in packages/backend/user/src/controllers/user.controller, then the handler property will be like:
	 * user/src/controllers/user-controller.handler
	 */
	handler: Delegate<[IRequest, Context], Promise<IResponse>>;

	/**
	 * Authorizer to apply to this route. This takes precedence over the authorizer that is applied on the group
	 */
	authorizer?: AvailableAuthorizers;
}

export type IRoute = ExclusiveUnion<[ISimpleRoute, IGroupedRoute]>;

export type IParams = Record<string, string>;

export interface IRouteParams<P extends IParams = IParams, Q extends IParams = IParams> {
	routeParams: P;
	queryParams: Q;
}

export interface IResolvedRoute extends ISimpleRoute, IRouteParams {}

export interface IRouter {
	registerRoutes(): Array<IRoute>;
}
