import type { Optional } from "@/stacks/types";
import type { RouteMethod } from "@/backend/router/enum";
import type { IRoute, IRouter, IRouteRegister, ISimpleRoute } from "@/backend/router/interface";

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

	public resolveRoute(path: string, method: RouteMethod): ISimpleRoute {
		const requestedPathSegments: Array<string> = path.split("/");

		const matchedRoute: Optional<ISimpleRoute> = this.builtRoutes.find((builtRoute: ISimpleRoute): boolean => {
			if (builtRoute.method !== method) return false;

			const routeToMatchSegments: Array<string> = builtRoute.path.split("/");
			if (requestedPathSegments.length !== routeToMatchSegments.length) return false;

			return this.matchRouteSegmentBySegment(requestedPathSegments, routeToMatchSegments);
		});

		if (matchedRoute) return matchedRoute;

		throw new Error(`Route with path: "${method} ${path}" not found!`);
	}

	private matchRouteSegmentBySegment(requestedPathSegments: Array<string>, routeToMatchSegments: Array<string>): boolean {
		let routeMatched = false;

		for (let [segmentIndex, lastSegmentIndex]: [number, number] = [0, requestedPathSegments.length - 1]; segmentIndex < requestedPathSegments.length; segmentIndex++) {
			const routeToMatchCurrentSegment: string = <string>routeToMatchSegments[segmentIndex];
			const requestedPathCurrentSegment: string = <string>requestedPathSegments[segmentIndex];

			if (routeToMatchCurrentSegment !== requestedPathCurrentSegment) {
				const isPlaceholderSegment: boolean = routeToMatchCurrentSegment.startsWith("{") && routeToMatchCurrentSegment.endsWith("}");

				if (!isPlaceholderSegment) return false;
			}

			if (segmentIndex === lastSegmentIndex) routeMatched = true;
		}

		return routeMatched;
	}
}
