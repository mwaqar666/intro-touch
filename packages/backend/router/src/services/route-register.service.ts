import type { Optional } from "@/stacks/types";
import { RouteBuilderConst } from "@/backend/router/const";
import type { IGroupedRoute, IRoute, IRouteGroup, IRouter, IRouteRegister, ISimpleRoute } from "@/backend/router/interface";

export class RouteRegisterService implements IRouteRegister {
	private moduleRoutes: Array<IRoute> = [];
	private builtRoutes: Array<ISimpleRoute> = [];

	public registerRouter(router: IRouter): IRouteRegister {
		this.moduleRoutes.push(...router.registerRoutes());

		return this;
	}

	public buildRoutes(): IRouteRegister {
		this.prepareRoutes(this.moduleRoutes, RouteBuilderConst.DefaultRouteGroup);

		return this;
	}

	public getBuiltRoutes(): Array<ISimpleRoute> {
		return this.builtRoutes;
	}

	public resolveRoute(path: string): ISimpleRoute {
		const matchedRoute: Optional<ISimpleRoute> = this.builtRoutes.find((builtRoute: ISimpleRoute): boolean => builtRoute.path === path);
		if (matchedRoute) return matchedRoute;

		throw new Error(`Route with path: "${path}" not registered!`);
	}

	private prepareRoutes(routes: Array<IRoute>, routeGroup: IRouteGroup): void {
		routes.forEach((route: IRoute): void => {
			if (this.isGroupedRoute(route)) {
				routeGroup.authorizer = route.authorizer ?? "none";
				routeGroup.prefix = this.prepareRouteSegments(routeGroup.prefix, route.prefix);

				this.prepareRoutes(route.routes, routeGroup);

				return;
			}

			route.authorizer = route.authorizer ?? routeGroup.authorizer;
			route.path = this.prepareRouteSegments(routeGroup.prefix, route.path);

			this.builtRoutes.push(route);
		});
	}

	private prepareRouteSegments(...segments: Array<Optional<string>>): string {
		return segments.reduce((segmentAccumulator: string, segment: Optional<string>): string => {
			if (!segment) return segmentAccumulator;

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
