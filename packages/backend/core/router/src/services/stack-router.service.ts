import { RouteType } from "@/backend-core/router/enum";
import type { IBuiltRoute, IStackRoute, IStackRouter } from "@/backend-core/router/interface";

export class StackRouterService implements IStackRouter {
	private stackRoutes: Array<IStackRoute>;

	public getApiStackRoutes(): Array<IStackRoute> {
		return this.stackRoutes;
	}

	public prepareApiStackRoutes(builtRoutes: Array<IBuiltRoute>): void {
		if (this.stackRoutes) return;

		this.stackRoutes = this.prepareRoutes(builtRoutes);
	}

	private prepareRoutes(builtRoutes: Array<IBuiltRoute>): Array<IStackRoute> {
		const stackRoutes: Array<IStackRoute> = [];

		for (const builtRoute of builtRoutes) {
			if (builtRoute.routeType === RouteType.APPLICATION) continue;

			stackRoutes.push({
				path: builtRoute.path,
				method: builtRoute.method,
			});
		}

		return stackRoutes;
	}
}
