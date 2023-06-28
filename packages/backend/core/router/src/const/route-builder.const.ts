import type { IBuiltGroupRoute } from "@/backend-core/router/interface";

export class RouteBuilderConst {
	public static readonly DefaultRouteGroup: IBuiltGroupRoute = {
		guards: [],
		prefix: "/",
		requestInterceptors: [],
		responseInterceptors: [],
	};
}
