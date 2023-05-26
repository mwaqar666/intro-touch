import type { Optional } from "@/stacks/types";
import { Service } from "typedi";
import { RouteBuilderConst } from "@/backend/router/const";
import type { IGroupedRoute, IRoute, IRouteBuilder, IRouteGroup, ISimpleRoute } from "@/backend/router/interface";

@Service()
export class RouteBuilderService implements IRouteBuilder {
	private compiledRoutes: Array<ISimpleRoute> = [];

	public getCompiledRoutes(): Array<ISimpleRoute> {
		return this.compiledRoutes;
	}

	public buildRoutesFrom(routes: Array<IRoute>): IRouteBuilder {
		this.prepareRoutes(routes, RouteBuilderConst.DefaultRouteGroup);

		return this;
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

			this.compiledRoutes.push(route);
		});
	}

	private prepareRouteSegments(...prefixes: Array<Optional<string>>): string {
		return prefixes.reduce((prefixAccumulator: string, prefix: Optional<string>): string => {
			if (!prefix) return prefixAccumulator;

			const parsedPrefix: string = this.parseRouteSegment(prefix);

			return `${prefixAccumulator}/${parsedPrefix}`;
		}, "");
	}

	private parseRouteSegment(prefix: string): string {
		while (prefix.startsWith("/")) prefix = prefix.slice(1);
		while (prefix.endsWith("/")) prefix = prefix.slice(0, prefix.length - 1);

		return prefix;
	}

	private isGroupedRoute(route: IRoute): route is IGroupedRoute {
		return !!route.prefix;
	}
}
