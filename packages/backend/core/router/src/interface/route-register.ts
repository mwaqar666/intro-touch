import type { AvailableAuthorizers } from "@/stacks/types";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { IResolvedRoute, IRoute, IRouter, ISimpleRoute } from "@/backend-core/router/interface/route";

export interface IRouteRegister {
	registerRouter(routes: IRouter): void;

	registerBuiltRoutes(routes: Array<ISimpleRoute>): void;

	getRegisteredRoutes(): Array<IRoute>;

	resolveRoute(path: string, method: RouteMethod): IResolvedRoute;
}

export interface IRouteGroup {
	prefix: string;
	authorizer: AvailableAuthorizers;
}
