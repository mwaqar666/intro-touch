import { ApplicationConst } from "@/backend/common/const";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { ApiRouteProps } from "sst/constructs";
import type { IRouteRegister, ISimpleRoute, IStackRouter } from "@/backend/router/interface";

export class StackRouterService implements IStackRouter {
	private stackRoutes: Record<string, ApiRouteProps<AvailableAuthorizers>>;

	public getApiStackRoutes(): Record<string, ApiRouteProps<AvailableAuthorizers>> {
		return this.stackRoutes;
	}

	public prepareApiStackRoutes(routeRegister: IRouteRegister): void {
		if (this.stackRoutes) return;

		const preparedRoutes: Array<[string, ApiRouteProps<AvailableAuthorizers>]> = this.prepareRoutes(routeRegister.getBuiltRoutes());

		this.stackRoutes = Object.fromEntries(preparedRoutes);
	}

	private prepareRoutes(simpleRoutes: Array<ISimpleRoute>): Array<[string, ApiRouteProps<AvailableAuthorizers>]> {
		return simpleRoutes.map((route: ISimpleRoute): [string, ApiRouteProps<AvailableAuthorizers>] => {
			const routeMethodAndPath: string = route.method.concat(` ${route.path}`);

			const routeProps: ApiRouteProps<AvailableAuthorizers> = {
				type: "function",
				function: ApplicationConst.ApplicationEntryPointHandler,
				authorizer: route.authorizer ?? "none",
			};

			return [routeMethodAndPath, routeProps];
		});
	}
}
