import type { AvailableAuthorizers } from "@/stacks/types";
import type { IRoute, IRouter, ISimpleRoute } from "@/backend/router/interface/route";

export interface IRouteRegister {
	registerRouter(routes: IRouter): void;

	registerBuiltRoutes(routes: Array<ISimpleRoute>): void;

	getRegisteredRoutes(): Array<IRoute>;

	resolveRoute(path: string): ISimpleRoute;
}

export interface IRouteGroup {
	prefix: string;
	authorizer: AvailableAuthorizers;
}
