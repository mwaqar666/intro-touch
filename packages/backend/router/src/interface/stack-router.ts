import type { AvailableAuthorizers } from "@/stacks/types";
import type { ApiRouteProps } from "sst/constructs";
import type { IRouteRegister } from "@/backend/router/interface/route-register";

export interface IStackRouter {
	getApiStackRoutes(): Record<string, ApiRouteProps<AvailableAuthorizers>>;

	prepareApiStackRoutes(routeRegister: IRouteRegister): void;
}
