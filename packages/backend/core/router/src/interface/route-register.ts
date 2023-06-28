import type { ApiRequest } from "@/stacks/types";
import type { IBuiltRoute, IResolvedRoute, IRoute, IRouter } from "@/backend-core/router/interface/route";

export interface IRouteRegister {
	registerRouter(routes: IRouter): void;

	registerBuiltRoutes(routes: Array<IBuiltRoute>): void;

	getRegisteredRoutes(): Array<IRoute>;

	resolveRoute(apiRequest: ApiRequest): IResolvedRoute;
}
