import type { AvailableAuthorizers } from "@/stacks/types";
import type { ApiRouteProps } from "sst/constructs";
import type { IRouteBuilder } from "@/backend/router/interface/route-builder";

export interface IStackRouter {
	getApiStackRoutes(): Record<string, ApiRouteProps<AvailableAuthorizers>>;

	prepareApiStackRoutes(routeBuilder: IRouteBuilder): void;
}
