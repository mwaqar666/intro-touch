import type { AvailableAuthorizers } from "@/stacks/types";
import type { IRouter, ISimpleRoute } from "@/backend/router/interface/route";

export interface IRouteRegister {
	registerRouter(routes: IRouter): IRouteRegister;

	buildRoutes(): IRouteRegister;

	getBuiltRoutes(): Array<ISimpleRoute>;

	getRoute(path: string): ISimpleRoute;
}

export interface IRouteGroup {
	prefix: string;
	authorizer: AvailableAuthorizers;
}
