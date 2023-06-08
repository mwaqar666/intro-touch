import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRoute, IRouteBuilder, IRouteRegister, ISimpleRoute, IStackRouter } from "@/backend-core/router/interface";
import { RouteBuilderService, RouteRegisterService, StackRouterService } from "@/backend-core/router/services";

export class RouterModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(RouterTokenConst.RouteBuilderToken, RouteBuilderService);
		this.container.registerSingleton(RouterTokenConst.RouteRegisterToken, RouteRegisterService);
		this.container.registerSingleton(RouterTokenConst.StackRouterToken, StackRouterService);
	}

	public override async postBoot(): Promise<void> {
		const routeBuilder: IRouteBuilder = this.container.resolve(RouterTokenConst.RouteBuilderToken);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		const stackRouter: IStackRouter = this.container.resolve(RouterTokenConst.StackRouterToken);

		const registeredRoutes: Array<IRoute> = routeRegister.getRegisteredRoutes();
		const builtRoutes: Array<ISimpleRoute> = routeBuilder.buildRoutes(registeredRoutes).getBuiltRoutes();

		stackRouter.prepareApiStackRoutes(builtRoutes);
		routeRegister.registerBuiltRoutes(builtRoutes);
	}
}
