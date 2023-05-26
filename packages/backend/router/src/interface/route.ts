import type { AvailableAuthorizers, ExclusiveUnion } from "@/stacks/types";
import type { RouteMethod } from "@/backend/router/enum";

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
	handler: string;

	/**
	 * Authorizer to apply to this route. This takes precedence over the authorizer that is applied on the group
	 */
	authorizer?: AvailableAuthorizers;
}

export type IRoute = ExclusiveUnion<[ISimpleRoute, IGroupedRoute]>;
