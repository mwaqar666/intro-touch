import type { ISimpleRoute, IStackRoute, IStackRouter } from "@/backend-core/router/interface";

export class StackRouterService implements IStackRouter {
	private stackRoutes: Array<IStackRoute>;

	public getApiStackRoutes(): Array<IStackRoute> {
		return this.stackRoutes;
	}

	public prepareApiStackRoutes(builtRoutes: Array<ISimpleRoute>): void {
		if (this.stackRoutes) return;

		this.stackRoutes = this.prepareRoutes(builtRoutes);
	}

	private prepareRoutes(simpleRoutes: Array<ISimpleRoute>): Array<IStackRoute> {
		return simpleRoutes.map(
			(route: ISimpleRoute): IStackRoute => ({
				path: route.path,
				method: route.method,
				authorizer: route.authorizer ?? "none",
			}),
		);
	}
}
