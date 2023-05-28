import { RouteBuilderConst } from "@/backend/router/const";
import type { IGroupedRoute, IRoute, IRouteBuilder, IRouteGroup, ISimpleRoute } from "@/backend/router/interface";

export class RouteBuilderService implements IRouteBuilder {
	private builtRoutes: Array<ISimpleRoute> = [];

	public buildRoutes(routes: Array<IRoute>): IRouteBuilder {
		this.prepareRoutes(routes, RouteBuilderConst.DefaultRouteGroup);

		return this;
	}

	public getBuiltRoutes(): Array<ISimpleRoute> {
		return this.builtRoutes;
	}

	private prepareRoutes(routes: Array<IRoute>, routeGroup: IRouteGroup): void {
		routes.forEach((route: IRoute): void => {
			if (this.isGroupedRoute(route)) {
				const routeGroupToPrepare: IRouteGroup = { ...routeGroup };

				routeGroupToPrepare.authorizer = route.authorizer ?? "none";
				routeGroupToPrepare.prefix = this.prepareRouteSegments(routeGroupToPrepare.prefix, route.prefix);

				this.prepareRoutes(route.routes, routeGroupToPrepare);

				return;
			}

			const routeToPrepare: ISimpleRoute = { ...route };

			routeToPrepare.authorizer = routeToPrepare.authorizer ?? routeGroup.authorizer;
			routeToPrepare.path = this.prepareRouteSegments(routeGroup.prefix, routeToPrepare.path);

			this.builtRoutes.push(routeToPrepare);
		});
	}

	private prepareRouteSegments(...segments: Array<string>): string {
		return segments.reduce((segmentAccumulator: string, segment: string): string => {
			segment = this.parseRouteSegment(segment);

			if (!segment) return segmentAccumulator;

			return `${segmentAccumulator}${segmentAccumulator === "/" ? "" : "/"}${segment}`;
		}, "/");
	}

	private parseRouteSegment(segment: string): string {
		while (segment.startsWith("/")) segment = segment.slice(1);
		while (segment.endsWith("/")) segment = segment.slice(0, segment.length - 1);

		return segment;
	}

	private isGroupedRoute(route: IRoute): route is IGroupedRoute {
		return !!route.prefix;
	}
}
