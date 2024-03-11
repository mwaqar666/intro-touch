import type { IGuard } from "@/backend-core/authentication/interface";
import { App } from "@/backend-core/core/extensions";
import { Response } from "@/backend-core/request-processor/handlers";
import type { IRequestInterceptor, IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { Constructable, Nullable } from "@/stacks/types";
import { OnDuplicateRegister } from "iocc";
import { RouteBuilderConst } from "@/backend-core/router/const";
import { RouteMethod, RouteType } from "@/backend-core/router/enum";
import type { IBuiltGroupRoute, IBuiltRoute, IGroupedRoute, IRoute, IRouteBuilder, IRouter, ISimpleRoute } from "@/backend-core/router/interface";

export class RouteBuilderService implements IRouteBuilder {
	private _moduleRoutes: Array<IRoute> = [];

	private _builtRoutes: Array<IBuiltRoute> = [];

	public get builtRoutes(): Array<IBuiltRoute> {
		return this._builtRoutes;
	}

	public addRouter(router: IRouter): void {
		this._moduleRoutes.push(...router.registerRoutes());
	}

	public buildRoutes(): IRouteBuilder {
		this.prepareRoutes(this._moduleRoutes, RouteBuilderConst.DefaultRouteGroup);

		return this;
	}

	private prepareRoutes(routes: Array<IRoute>, routeGroup: IBuiltGroupRoute): void {
		routes.forEach((route: IRoute): void => {
			if (this.isGroupedRoute(route)) {
				const routeGroupToPrepare: IBuiltGroupRoute = this.prepareGroupedRoute(route, routeGroup);

				this.prepareRoutes(route.routes, routeGroupToPrepare);

				return;
			}

			const builtRoute: IBuiltRoute = this.prepareSimpleRoute(route, routeGroup);

			this._builtRoutes.push(builtRoute);

			const corsRoute: Nullable<IBuiltRoute> = this.prepareCorsRouteIfRequired(builtRoute);

			if (!corsRoute) return;

			this._builtRoutes.push(corsRoute);
		});
	}

	private isGroupedRoute(route: IRoute): route is IGroupedRoute {
		return !!route.prefix;
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

	private registerRouteRunnersWithContainer<T>(runners: Array<Constructable<T, Array<any>>>): void {
		runners.forEach((runner: Constructable<T, Array<any>>): void => {
			App.container.registerSingleton(runner, { onDuplicate: OnDuplicateRegister.IGNORE });
		});
	}

	private prepareGroupedRoute(route: IGroupedRoute, routeGroup: IBuiltGroupRoute): IBuiltGroupRoute {
		const routeGroupToPrepare: IBuiltGroupRoute = { ...routeGroup };

		routeGroupToPrepare.prefix = this.prepareRouteSegments(routeGroupToPrepare.prefix, route.prefix);

		if (route.guards) routeGroupToPrepare.guards = [...routeGroupToPrepare.guards, ...route.guards];

		if (route.routeType) routeGroupToPrepare.routeType = route.routeType;

		if (route.requestInterceptors) routeGroupToPrepare.requestInterceptors = [...routeGroupToPrepare.requestInterceptors, ...route.requestInterceptors];

		if (route.responseInterceptors) routeGroupToPrepare.responseInterceptors = [...routeGroupToPrepare.responseInterceptors, ...route.responseInterceptors];

		return routeGroupToPrepare;
	}

	private prepareSimpleRoute(route: ISimpleRoute, routeGroup: IBuiltGroupRoute): IBuiltRoute {
		const routeToPrepare: IBuiltRoute = {
			path: this.prepareRouteSegments(routeGroup.prefix, route.path),
			method: route.method,
			handler: route.handler,
			guards: [],
			routeType: routeGroup.routeType,
			requestInterceptors: [],
			responseInterceptors: [],
		};

		if (route.routeType) routeToPrepare.routeType = route.routeType;

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

		return routeToPrepare;
	}

	private prepareCorsRouteIfRequired(builtRoute: IBuiltRoute): Nullable<IBuiltRoute> {
		if (builtRoute.method === RouteMethod.Get || builtRoute.method === RouteMethod.Head) return null;

		return {
			path: builtRoute.path,
			method: RouteMethod.Options,
			handler: (): Response => {
				const response: Response = App.container.resolve(Response);

				response.setHeaders({
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": builtRoute.method,
					"Access-Control-Allow-Headers": "*",
				});

				return response;
			},
			guards: [],
			routeType: RouteType.Application,
			requestInterceptors: [],
			responseInterceptors: [],
		};
	}
}
