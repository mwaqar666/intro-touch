import type { IRoute, ISimpleRoute } from "@/backend/router/interface/route";

export interface IRouteBuilder {
	buildRoutes(routes: Array<IRoute>): IRouteBuilder;

	getBuiltRoutes(): Array<ISimpleRoute>;
}
