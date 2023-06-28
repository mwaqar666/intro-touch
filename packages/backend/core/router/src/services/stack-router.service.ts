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

	private prepareRoutes(simpleRoutes: Array<IBuiltRoute>): Array<IStackRoute> {
		return simpleRoutes.map(({ path, method }: IBuiltRoute): IStackRoute => ({ path, method }));
	}
}
