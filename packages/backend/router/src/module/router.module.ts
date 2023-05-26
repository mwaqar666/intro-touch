import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRouteRegister, IStackRouter } from "@/backend/router/interface";
import { RouteHandlerService, RouteRegisterService, StackRouterService } from "@/backend/router/services";

export class RouterModule extends AbstractModule {
	public override register(): void {
		this.container.registerSingleton(RouterTokenConst.RouteRegisterToken, { type: RouteRegisterService });
		this.container.registerSingleton(RouterTokenConst.StackRouterToken, { type: StackRouterService });
		this.container.registerSingleton(RouterTokenConst.RouteHandlerToken, { type: RouteHandlerService });
	}

	public override postBoot(): void {
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		const stackRouter: IStackRouter = this.container.resolve(RouterTokenConst.StackRouterToken);

		stackRouter.prepareApiStackRoutes(routeRegister.buildRoutes());
	}
}
