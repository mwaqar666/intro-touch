import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRoute, IRouteBuilder, IRouteRegister, ISimpleRoute, IStackRouter } from "@/backend/router/interface";
import { RouteBuilderService, RouteHandlerService, RouteRegisterService, StackRouterService } from "@/backend/router/services";

export class RouterModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(RouterTokenConst.RouteBuilderToken, RouteBuilderService);
		this.container.registerSingleton(RouterTokenConst.RouteRegisterToken, RouteRegisterService);
		this.container.registerSingleton(RouterTokenConst.StackRouterToken, StackRouterService);
		this.container.registerSingleton(RouterTokenConst.RouteHandlerToken, RouteHandlerService);
	}

	public override async postBoot(): Promise<void> {
		const routeBuilder: IRouteBuilder = this.container.resolve(RouterTokenConst.RouteBuilderToken);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		const stackRouter: IStackRouter = this.container.resolve(RouterTokenConst.StackRouterToken);

		const registeredRoutes: Array<IRoute> = routeRegister.getRegisteredRoutes();
		const builtRoutes: Array<ISimpleRoute> = routeBuilder.buildRoutes(registeredRoutes).getBuiltRoutes();

		routeRegister.registerBuiltRoutes(builtRoutes);
		stackRouter.prepareApiStackRoutes(builtRoutes);
	}
}
