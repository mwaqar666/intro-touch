import type { IBuiltRoute, IRouter } from "@/backend-core/router/interface/route";

export interface IRouteBuilder {
	get builtRoutes(): Array<IBuiltRoute>;

	addRouter(router: IRouter): void;

	buildRoutes(): IRouteBuilder;
}
