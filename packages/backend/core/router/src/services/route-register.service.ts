import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { ApiRequest, Nullable } from "@/stacks/types";
import { RouteBuilderConst } from "@/backend-core/router/const";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { IBuiltRoute, IPathParams, IResolvedRoute, IRoute, IRouter, IRouteRegister, ISimpleRoute } from "@/backend-core/router/interface";

export class RouteRegisterService implements IRouteRegister {
	private moduleRoutes: Array<IRoute> = [];
	private builtRoutes: Array<IBuiltRoute> = [];

	public addRouter(router: IRouter): void {
		this.moduleRoutes.push(...router.registerRoutes());
	}

	public getRegisteredRoutes(): Array<IRoute> {
		return this.moduleRoutes;
	}

	public registerBuiltRoutes(routes: Array<IBuiltRoute>): void {
		this.builtRoutes = routes;
	}

	public resolveRoute(apiRequest: ApiRequest): IResolvedRoute {
		const { method, path } = apiRequest.requestContext.http;

		const matchedRoute: Nullable<[Required<ISimpleRoute>, IPathParams]> = this.matchRouteInRegisteredRoutes(<RouteMethod>method, path);
		if (!matchedRoute) throw new InternalServerException(`Route with path: '[${method}]: ${path}' not found!`);

		const [builtRoute, pathParams]: [Required<ISimpleRoute>, IPathParams] = matchedRoute;

		return {
			...builtRoute,
			pathParams,
			queryParams: apiRequest.queryStringParameters ?? {},
		};
	}

	private matchRouteInRegisteredRoutes(method: RouteMethod, path: string): Nullable<[Required<ISimpleRoute>, IPathParams]> {
		const requestedPathSegments: Array<string> = path.split("/");

		for (const builtRoute of this.builtRoutes) {
			if (builtRoute.method !== method) continue;

			const routeToMatchSegments: Array<string> = builtRoute.path.split("/");
			if (requestedPathSegments.length !== routeToMatchSegments.length) continue;

			const matchedRouteParams: Nullable<IPathParams> = this.matchRouteSegmentBySegment(requestedPathSegments, routeToMatchSegments);

			if (matchedRouteParams) return [builtRoute, matchedRouteParams];
		}

		return null;
	}

	private matchRouteSegmentBySegment(requestedPathSegments: Array<string>, routeToMatchSegments: Array<string>): Nullable<IPathParams> {
		const routeParams: IPathParams = {};

		for (let segmentIndex = 0; segmentIndex < requestedPathSegments.length; segmentIndex++) {
			const routeToMatchCurrentSegment: string = <string>routeToMatchSegments[segmentIndex];
			const requestedPathCurrentSegment: string = <string>requestedPathSegments[segmentIndex];

			if (routeToMatchCurrentSegment === requestedPathCurrentSegment) continue;

			const isRouteParameterSegment: boolean = routeToMatchCurrentSegment.startsWith(RouteBuilderConst.RouteSegmentStart) && routeToMatchCurrentSegment.endsWith(RouteBuilderConst.RouteSegmentEnd);
			if (!isRouteParameterSegment) return null;

			const currentRouteParameter: string = routeToMatchCurrentSegment.slice(1, routeToMatchCurrentSegment.length - 1);
			routeParams[currentRouteParameter] = requestedPathCurrentSegment;
		}

		return routeParams;
	}
}
