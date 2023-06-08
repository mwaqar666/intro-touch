import type { IRouteGroup } from "@/backend-core/router/interface";

export class RouteBuilderConst {
	public static readonly DefaultRouteGroup: IRouteGroup = {
		prefix: "/",
		authorizer: "none",
	};

	public static readonly RouteSegmentStart = "{";
	public static readonly RouteSegmentEnd = "}";
}
