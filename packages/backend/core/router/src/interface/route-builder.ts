import type { IRoute, ISimpleRoute } from "@/backend-core/router/interface/route";

export interface IRouteBuilder {
	buildRoutes(routes: Array<IRoute>): IRouteBuilder;

	getBuiltRoutes(): Array<ISimpleRoute>;
}
