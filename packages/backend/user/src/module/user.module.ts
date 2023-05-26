import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRouter, IRouteRegister } from "@/backend/router/interface";
import { UserTokenConst } from "@/backend/user/const";
import { UserRouter } from "@/backend/user/router";

export class UserModule extends AbstractModule {
	public override register(): void {
		this.container.registerSingleton(UserTokenConst.UserRouterToken, { type: UserRouter });
	}

	public override boot(): void {
		const userRouter: IRouter = this.container.resolve(UserTokenConst.UserRouterToken);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);

		routeRegister.registerRouter(userRouter);
	}
}
