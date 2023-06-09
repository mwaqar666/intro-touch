import type { ApiRequest, Optional } from "@/stacks/types";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { IParams, IResolvedRoute, IRoute, IRouter, IRouteRegister, ISimpleRoute } from "@/backend-core/router/interface";

export class RouteRegisterService implements IRouteRegister {
	private moduleRoutes: Array<IRoute> = [];
	private builtRoutes: Array<ISimpleRoute> = [];

	public registerRouter(router: IRouter): void {
		this.moduleRoutes.push(...router.registerRoutes());
	}

	public getRegisteredRoutes(): Array<IRoute> {
		return this.moduleRoutes;
	}

	public registerBuiltRoutes(routes: Array<ISimpleRoute>): void {
		this.builtRoutes = routes;
	}

	public resolveRoute(apiRequest: ApiRequest): IResolvedRoute {
		const [method, path] = <[RouteMethod, string]>apiRequest.routeKey.split(" ");

		const matchedRoute: Optional<ISimpleRoute> = this.builtRoutes.find((builtRoute: ISimpleRoute): boolean => {
			return builtRoute.method === method && builtRoute.path === path;
		});

		if (matchedRoute)
			return {
				...matchedRoute,
				routeParams: this.getTypedRouteParams(apiRequest),
				queryParams: this.getTypedQueryParams(apiRequest),
			};

		throw new Error(`Route with path: "${method} ${path}" not found!`);
	}

	private getTypedRouteParams(apiRequest: ApiRequest): IParams {
		return <IParams>(apiRequest.pathParameters ?? {});
	}

	private getTypedQueryParams(apiRequest: ApiRequest): IParams {
		return <IParams>(apiRequest.queryStringParameters ?? {});
	}
}
