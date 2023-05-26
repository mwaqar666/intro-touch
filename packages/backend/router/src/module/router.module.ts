import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRoute, IRouteBuilder, IStackRouter } from "@/backend/router/interface";
import { RouteBuilderService, StackRouterService } from "@/backend/router/services";

export class RouterModule extends AbstractModule {
	public register(): void {
		this.container.set(RouterTokenConst.RouteBuilderToken, { type: RouteBuilderService });
		this.container.set(RouterTokenConst.StackRouterToken, { type: StackRouterService });
	}

	public boot(): void {
		const routeBuilder: IRouteBuilder = this.container.get(RouterTokenConst.RouteBuilderToken);
		const stackRouter: IStackRouter = this.container.get(RouterTokenConst.StackRouterToken);
		const applicationRoutes: Array<IRoute> = this.container.get(RouterTokenConst.RouteToken);

		stackRouter.prepareApiStackRoutes(routeBuilder.buildRoutesFrom(applicationRoutes));
	}
}
