import type { IRouteGroup } from "@/backend/router/interface";

export class RouteBuilderConst {
	public static readonly DefaultRouteGroup: IRouteGroup = {
		prefix: "/",
		authorizer: "none",
	};
}
