import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { ApiRequest, Optional } from "@/stacks/types";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { IBuiltRoute, IPathParams, IQueryParams, IResolvedRoute, IRoute, IRouter, IRouteRegister } from "@/backend-core/router/interface";

export class RouteRegisterService implements IRouteRegister {
	private moduleRoutes: Array<IRoute> = [];
	private builtRoutes: Array<IBuiltRoute> = [];

	public registerRouter(router: IRouter): void {
		this.moduleRoutes.push(...router.registerRoutes());
	}

	public getRegisteredRoutes(): Array<IRoute> {
		return this.moduleRoutes;
	}

	public registerBuiltRoutes(routes: Array<IBuiltRoute>): void {
		this.builtRoutes = routes;
	}

	public resolveRoute(apiRequest: ApiRequest): IResolvedRoute {
		const [method, path]: [RouteMethod, string] = <[RouteMethod, string]>apiRequest.routeKey.split(" ");

		const matchedRoute: Optional<IBuiltRoute> = this.builtRoutes.find((builtRoute: IBuiltRoute): boolean => {
			return builtRoute.method === method && builtRoute.path === path;
		});

		if (matchedRoute) {
			return {
				...matchedRoute,
				pathParams: this.getTypedPathParams(apiRequest),
				queryParams: this.getTypedQueryParams(apiRequest),
			};
		}

		throw new InternalServerException(`Route with path: "${apiRequest.routeKey}" not found!`);
	}

	private getTypedPathParams(apiRequest: ApiRequest): IPathParams {
		return <IPathParams>apiRequest.pathParameters ?? {};
	}

	private getTypedQueryParams(apiRequest: ApiRequest): IQueryParams {
		return <IQueryParams>(apiRequest.queryStringParameters ?? {});
	}
}
