import type { Optional } from "@/stacks/types";
import type { IRoute, IRouter, IRouteRegister, ISimpleRoute } from "@/backend/router/interface";

export class RouteRegisterService<T = unknown> implements IRouteRegister<T> {
	private moduleRoutes: Array<IRoute> = [];
	private builtRoutes: Array<ISimpleRoute> = [];

	public registerRouter(router: IRouter<T>): void {
		this.moduleRoutes.push(...router.registerRoutes());
	}

	public getRegisteredRoutes(): Array<IRoute> {
		return this.moduleRoutes;
	}

	public registerBuiltRoutes(routes: Array<ISimpleRoute>): void {
		this.builtRoutes = routes;
	}

	public resolveRoute(path: string): ISimpleRoute {
		const matchedRoute: Optional<ISimpleRoute> = this.builtRoutes.find((builtRoute: ISimpleRoute): boolean => builtRoute.path === path);

		if (matchedRoute) return matchedRoute;

		throw new Error(`Route with path: "${path}" not registered!`);
	}
}
