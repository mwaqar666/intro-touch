import type { IBuiltRoute, IStackRoute } from "@/backend-core/router/interface/route";

export interface IStackRouter {
	getApiStackRoutes(): Array<IStackRoute>;

	prepareApiStackRoutes(builtRoutes: Array<IBuiltRoute>): void;
}
