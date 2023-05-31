import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRoute, IRouteBuilder, IRouteRegister, ISimpleRoute } from "@/backend/router/interface";
import { RouteBuilderService, RouteHandlerService, RouteRegisterService } from "@/backend/router/services";

export class RouterModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(RouterTokenConst.RouteBuilderToken, RouteBuilderService);
		this.container.registerSingleton(RouterTokenConst.RouteRegisterToken, RouteRegisterService);
		this.container.registerSingleton(RouterTokenConst.RouteHandlerToken, RouteHandlerService);
	}

	public override async postBoot(): Promise<void> {
		const routeBuilder: IRouteBuilder = this.container.resolve(RouterTokenConst.RouteBuilderToken);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);

		const registeredRoutes: Array<IRoute> = routeRegister.getRegisteredRoutes();
		const builtRoutes: Array<ISimpleRoute> = routeBuilder.buildRoutes(registeredRoutes).getBuiltRoutes();

		routeRegister.registerBuiltRoutes(builtRoutes);
	}
}
