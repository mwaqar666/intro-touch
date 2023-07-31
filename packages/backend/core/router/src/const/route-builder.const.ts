import { RouteType } from "@/backend-core/router/enum";
import type { IBuiltGroupRoute } from "@/backend-core/router/interface";

export class RouteBuilderConst {
	public static readonly RouteSegmentStart: string = "{";
	public static readonly RouteSegmentEnd: string = "}";

	public static readonly DefaultRouteGroup: IBuiltGroupRoute = {
		prefix: "/",
		guards: [],
		routeType: RouteType.GLOBAL,
		requestInterceptors: [],
		responseInterceptors: [],
	};
}
