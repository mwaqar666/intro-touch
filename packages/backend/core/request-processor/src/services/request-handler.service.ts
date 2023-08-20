import { RouteBuilderConst, RouterTokenConst } from "@/backend-core/router/const";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { IBuiltRoute, IPathParams, IQueryParams, IResolvedRoute, IRouteBuilder } from "@/backend-core/router/interface";
import type { ApiRequest, Nullable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { useEvent, useLambdaContext } from "sst/context";
import { useJsonBody } from "sst/node/api";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { IRequestHandler } from "@/backend-core/request-processor/interface";
import type { IAppRequest } from "@/backend-core/request-processor/types";

export class RequestHandlerService implements IRequestHandler {
	private _route: IResolvedRoute;
	private _request: IAppRequest;
	private readonly _rawRequest: ApiRequest;

	public constructor(
		// Dependencies

		@Inject(RouterTokenConst.RouteBuilderToken) private readonly routeBuilder: IRouteBuilder,
	) {
		this._rawRequest = useEvent("api");
	}

	public getRequest<T = object, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams>(): IAppRequest<T, P, Q> {
		if (this._request) return <IAppRequest<T, P, Q>>this._request;

		this._request = {
			...this._rawRequest,
			body: useJsonBody() ?? {},
			pathParams: this.getRoute().pathParams,
			queryParams: this.getRoute().queryParams,
		};

		return <IAppRequest<T, P, Q>>this._request;
	}

	public getContext(): Context {
		return useLambdaContext();
	}

	public getRoute<P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams>(): IResolvedRoute<P, Q> {
		if (this._route) return <IResolvedRoute<P, Q>>this._route;

		const { method, path } = this._rawRequest.requestContext.http;

		const matchedRoute: Nullable<[IBuiltRoute, IPathParams]> = this.matchRouteInRegisteredRoutes(<RouteMethod>method, path);
		if (!matchedRoute) throw new InternalServerException(`Route with path: '[${method}]: ${path}' not found!`);

		const [resolvedRoute, pathParams]: [IBuiltRoute, IPathParams] = matchedRoute;

		this._route = {
			...resolvedRoute,
			pathParams,
			queryParams: this._rawRequest.queryStringParameters ?? {},
		};

		return <IResolvedRoute<P, Q>>this._route;
	}

	private matchRouteInRegisteredRoutes(method: RouteMethod, path: string): Nullable<[IBuiltRoute, IPathParams]> {
		const requestedPathSegments: Array<string> = path.split("/");

		for (const route of this.routeBuilder.builtRoutes) {
			if (route.method !== method) continue;

			const routeToMatchSegments: Array<string> = route.path.split("/");
			if (requestedPathSegments.length !== routeToMatchSegments.length) continue;

			const matchedRouteParams: Nullable<IPathParams> = this.matchRouteSegmentBySegment(requestedPathSegments, routeToMatchSegments);

			if (matchedRouteParams) return [route, matchedRouteParams];
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
