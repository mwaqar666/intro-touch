import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouteBuilder, IStackRouter } from "@/backend-core/router/interface";
import { RouteBuilderService, RouteResolverService, StackRouterService } from "@/backend-core/router/services";

export class RouterModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(RouterTokenConst.RouteBuilderToken, RouteBuilderService);
		this.container.registerScoped(RouterTokenConst.RouteResolverToken, RouteResolverService);
		this.container.registerSingleton(RouterTokenConst.StackRouterToken, StackRouterService);
	}

	public override async postBoot(): Promise<void> {
		const routeBuilder: IRouteBuilder = this.container.resolve(RouterTokenConst.RouteBuilderToken);
		const stackRouter: IStackRouter = this.container.resolve(RouterTokenConst.StackRouterToken);

		stackRouter.prepareApiStackRoutes(routeBuilder.buildRoutes().builtRoutes);
	}
}
