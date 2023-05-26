import type { AvailableAuthorizers } from "@/stacks/types";
import type { ApiRouteProps } from "sst/constructs";
import { Service } from "typedi";
import type { IRouteBuilder, ISimpleRoute, IStackRouter } from "@/backend/router/interface";

@Service()
export class StackRouterService implements IStackRouter {
	private stackRoutes: Record<string, ApiRouteProps<AvailableAuthorizers>>;

	public getApiStackRoutes(): Record<string, ApiRouteProps<AvailableAuthorizers>> {
		return this.stackRoutes;
	}

	public prepareApiStackRoutes(routeBuilder: IRouteBuilder): void {
		if (this.stackRoutes) return;

		const preparedRoutes: Array<[string, ApiRouteProps<AvailableAuthorizers>]> = this.prepareRoutes(routeBuilder.getCompiledRoutes());

		this.stackRoutes = Object.fromEntries(preparedRoutes);
	}

	private prepareRoutes(simpleRoutes: Array<ISimpleRoute>): Array<[string, ApiRouteProps<AvailableAuthorizers>]> {
		return simpleRoutes.map((route: ISimpleRoute): [string, ApiRouteProps<AvailableAuthorizers>] => {
			const routeMethodAndPath: string = route.method.concat(` ${route.path}`);

			const routeProps: ApiRouteProps<AvailableAuthorizers> = {
				type: "function",
				function: route.handler,
				authorizer: route.authorizer ?? "none",
			};

			return [routeMethodAndPath, routeProps];
		});
	}
}
