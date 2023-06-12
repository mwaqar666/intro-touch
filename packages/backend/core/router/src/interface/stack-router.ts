import type { AvailableAuthorizers } from "@/stacks/types";
import type { RouteMethod } from "@/backend-core/router/enum";
import type { ISimpleRoute } from "@/backend-core/router/interface/route";

export interface IStackRoute {
	path: string;
	method: RouteMethod;
	authorizer: AvailableAuthorizers;
}

export interface IStackRouter {
	getApiStackRoutes(): Array<IStackRoute>;

	prepareApiStackRoutes(builtRoutes: Array<ISimpleRoute>): void;
}
