import type { ApiRequest, AvailableAuthorizers } from "@/stacks/types";
import type { IResolvedRoute, IRoute, IRouter, ISimpleRoute } from "@/backend-core/router/interface/route";

export interface IRouteRegister {
	registerRouter(routes: IRouter): void;

	registerBuiltRoutes(routes: Array<ISimpleRoute>): void;

	getRegisteredRoutes(): Array<IRoute>;

	resolveRoute(apiRequest: ApiRequest): IResolvedRoute;
}

export interface IRouteGroup {
	prefix: string;
	authorizer: AvailableAuthorizers;
}
