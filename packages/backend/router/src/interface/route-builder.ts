import type { AvailableAuthorizers } from "@/stacks/types";
import type { IRoute, ISimpleRoute } from "@/backend/router/interface/route";

export interface IRouteBuilder {
	buildRoutesFrom(routes: Array<IRoute>): IRouteBuilder;

	getCompiledRoutes(): Array<ISimpleRoute>;
}

export interface IRouteGroup {
	prefix: string;
	authorizer: AvailableAuthorizers;
}
