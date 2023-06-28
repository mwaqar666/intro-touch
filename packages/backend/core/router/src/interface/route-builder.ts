import type { IBuiltRoute, IRoute } from "@/backend-core/router/interface/route";

export interface IRouteBuilder {
	buildRoutes(routes: Array<IRoute>): IRouteBuilder;

	getBuiltRoutes(): Array<IBuiltRoute>;
}
