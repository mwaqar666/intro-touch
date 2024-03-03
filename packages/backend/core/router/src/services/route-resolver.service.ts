import { NotFoundException } from "@/backend-core/request-processor/exceptions";
import type { ApiRequest, Key, Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import { useEvent } from "sst/context";
import { RouteBuilderConst, RouterTokenConst } from "@/backend-core/router/const";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { IBuiltRoute, IPathParams, IQueryParams, IResolvedRoute, IRouteBuilder, IRouteResolver } from "@/backend-core/router/interface";

export class RouteResolverService<P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> implements IRouteResolver<P, Q> {
	private _resolvedRoute: Nullable<IResolvedRoute<P, Q>> = null;

	public constructor(@Inject(RouterTokenConst.RouteBuilderToken) private readonly routeBuilder: IRouteBuilder) {}

	public resolveRoute(): IResolvedRoute<P, Q> {
		if (this._resolvedRoute) return this._resolvedRoute;

		const rawRequest: ApiRequest = useEvent("api");

		const { method, path } = rawRequest.requestContext.http;

		const matchedRoute: Nullable<[IBuiltRoute, P]> = this.matchRouteInRegisteredRoutes(<RouteMethod>method, path);
		if (!matchedRoute) throw new NotFoundException(`Route with path: '[${method}]: ${path}' not found!`);

		const [resolvedRoute, pathParams]: [IBuiltRoute, P] = matchedRoute;
		const queryParams: Q = (rawRequest.queryStringParameters ?? {}) as Q;

		this._resolvedRoute = { ...resolvedRoute, pathParams, queryParams };

		return this._resolvedRoute;
	}

	private matchRouteInRegisteredRoutes(method: RouteMethod, path: string): Nullable<[IBuiltRoute, P]> {
		const requestedPathSegments: Array<string> = path.split("/");

		for (const route of this.routeBuilder.builtRoutes) {
			if (method !== route.method) continue;

			const routeToMatchSegments: Array<string> = route.path.split("/");
			if (requestedPathSegments.length !== routeToMatchSegments.length) continue;

			const matchedRouteParams: Nullable<P> = this.matchRouteSegmentBySegment(requestedPathSegments, routeToMatchSegments);

			if (matchedRouteParams) return [route, matchedRouteParams];
		}

		return null;
	}

	private matchRouteSegmentBySegment(requestedPathSegments: Array<string>, routeToMatchSegments: Array<string>): Nullable<P> {
		const routeParams: P = {} as P;

		for (let segmentIndex = 0; segmentIndex < requestedPathSegments.length; segmentIndex++) {
			const routeToMatchCurrentSegment: string = <string>routeToMatchSegments[segmentIndex];
			const requestedPathCurrentSegment: P[Key<P>] = <P[Key<P>]>requestedPathSegments[segmentIndex];

			if (routeToMatchCurrentSegment === requestedPathCurrentSegment) continue;

			const isRouteParameterSegment: boolean = routeToMatchCurrentSegment.startsWith(RouteBuilderConst.RouteSegmentStart) && routeToMatchCurrentSegment.endsWith(RouteBuilderConst.RouteSegmentEnd);
			if (!isRouteParameterSegment) return null;

			const currentRouteParameter: Key<P> = routeToMatchCurrentSegment.slice(1, routeToMatchCurrentSegment.length - 1);
			routeParams[currentRouteParameter] = requestedPathCurrentSegment;
		}

		return routeParams;
	}
}
