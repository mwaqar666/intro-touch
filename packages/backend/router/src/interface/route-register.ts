import type { AvailableAuthorizers } from "@/stacks/types";
import type { RouteMethod } from "@/backend/router/enum";
import type { IRoute, IRouter, ISimpleRoute } from "@/backend/router/interface/route";

export interface IRouteRegister {
	registerRouter(routes: IRouter): void;

	registerBuiltRoutes(routes: Array<ISimpleRoute>): void;

	getRegisteredRoutes(): Array<IRoute>;

	resolveRoute(path: string, method: RouteMethod): ISimpleRoute;
}

export interface IRouteGroup {
	prefix: string;
	authorizer: AvailableAuthorizers;
}
