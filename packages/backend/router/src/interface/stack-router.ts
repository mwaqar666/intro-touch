import type { AvailableAuthorizers } from "@/stacks/types";
import type { ApiRouteProps } from "sst/constructs";
import type { ISimpleRoute } from "@/backend/router/interface/route";

export interface IStackRouter {
	getApiStackRoutes(): Record<string, ApiRouteProps<AvailableAuthorizers>>;

	prepareApiStackRoutes(builtRoutes: Array<ISimpleRoute>): void;
}
