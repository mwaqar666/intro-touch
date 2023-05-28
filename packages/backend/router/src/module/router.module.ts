import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRouteRegister, IStackRouter } from "@/backend/router/interface";

export class RouterModule extends AbstractModule {
	public override async register(): Promise<void> {
		const { RouteHandlerService, RouteRegisterService, StackRouterService } = await import("@/backend/router/services");

		this.container.registerSingleton(RouterTokenConst.RouteRegisterToken, RouteRegisterService);
		this.container.registerSingleton(RouterTokenConst.StackRouterToken, StackRouterService);
		this.container.registerSingleton(RouterTokenConst.RouteHandlerToken, RouteHandlerService);
	}

	public override async postBoot(): Promise<void> {
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		const stackRouter: IStackRouter = this.container.resolve(RouterTokenConst.StackRouterToken);

		stackRouter.prepareApiStackRoutes(routeRegister.buildRoutes());
	}
}
