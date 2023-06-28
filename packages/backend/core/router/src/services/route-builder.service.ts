import type { IGuard } from "@/backend-core/authentication/interface";
import { AppContainer } from "@/backend-core/core/extensions";
import type { IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { Constructable } from "@/stacks/types";
import { RouteBuilderConst } from "@/backend-core/router/const";
import type { IBuiltGroupRoute, IBuiltRoute, IGroupedRoute, IRoute, IRouteBuilder } from "@/backend-core/router/interface";

export class RouteBuilderService implements IRouteBuilder {
	private builtRoutes: Array<IBuiltRoute> = [];

	public buildRoutes(routes: Array<IRoute>): IRouteBuilder {
		this.prepareRoutes(routes, RouteBuilderConst.DefaultRouteGroup);

		return this;
	}

	public getBuiltRoutes(): Array<IBuiltRoute> {
		return this.builtRoutes;
	}

	private prepareRoutes(routes: Array<IRoute>, routeGroup: IBuiltGroupRoute): void {
		routes.forEach((route: IRoute): void => {
			if (this.isGroupedRoute(route)) {
				const routeGroupToPrepare: IBuiltGroupRoute = { ...routeGroup };

				routeGroupToPrepare.prefix = this.prepareRouteSegments(routeGroupToPrepare.prefix, route.prefix);

				if (route.guards) routeGroupToPrepare.guards = [...routeGroupToPrepare.guards, ...route.guards];

				if (route.requestInterceptors) routeGroupToPrepare.requestInterceptors = [...routeGroupToPrepare.requestInterceptors, ...route.requestInterceptors];

				if (route.responseInterceptors) routeGroupToPrepare.responseInterceptors = [...routeGroupToPrepare.responseInterceptors, ...route.responseInterceptors];

				this.prepareRoutes(route.routes, routeGroupToPrepare);

				return;
			}

			const routeToPrepare: IBuiltRoute = {
				path: this.prepareRouteSegments(routeGroup.prefix, route.path),
				method: route.method,
				handler: route.handler,
				guards: [],
				requestInterceptors: [],
				responseInterceptors: [],
			};

			const routeGuards: Constructable<IGuard, Array<any>>[] = [...routeGroup.guards];
			if (route.guards) routeGuards.push(...route.guards);
			this.registerRouteRunnersWithContainer(routeGuards);
			routeToPrepare.guards = routeGuards;

			const routeRequestInterceptors: Constructable<IRequestInterceptor, Array<any>>[] = [...routeGroup.requestInterceptors];
			if (route.requestInterceptors) routeRequestInterceptors.push(...route.requestInterceptors);
			this.registerRouteRunnersWithContainer(routeRequestInterceptors);
			routeToPrepare.requestInterceptors = routeRequestInterceptors;

			const routeResponseInterceptors: Constructable<IResponseInterceptor, Array<any>>[] = [...routeGroup.responseInterceptors];
			if (route.responseInterceptors) routeResponseInterceptors.push(...route.responseInterceptors);
			this.registerRouteRunnersWithContainer(routeResponseInterceptors);
			routeToPrepare.responseInterceptors = routeResponseInterceptors;

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

	private registerRouteRunnersWithContainer<T>(runners: Array<Constructable<T, Array<any>>>): void {
		runners.forEach((runner: Constructable<T, Array<any>>): void => {
			AppContainer.registerSingleton(runner, { onDuplicate: "ignore" });
		});
	}
}
