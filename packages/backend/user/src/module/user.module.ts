import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRouteRegister } from "@/backend/router/interface";
import type { AbstractRouter } from "@/backend/router/services";
import { UserTokenConst } from "@/backend/user/const";
import { UserController } from "@/backend/user/controller";
import type { IUserRouter } from "@/backend/user/router";
import { UserRouter } from "@/backend/user/router";
import { UserService } from "@/backend/user/services";

export class UserModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(UserTokenConst.UserServiceToken, UserService);
		this.container.registerSingleton(UserTokenConst.UserControllerToken, UserController);
		this.container.registerSingleton(UserTokenConst.UserRouterToken, UserRouter);
	}

	public override async preBoot(): Promise<void> {
		const userController: UserController = this.container.resolve(UserTokenConst.UserControllerToken);
		const userRouter: AbstractRouter<IUserRouter> = this.container.resolve(UserTokenConst.UserRouterToken);

		userRouter.setControllers({ user: userController });
	}

	public override async boot(): Promise<void> {
		const userRouter: AbstractRouter<IUserRouter> = this.container.resolve(UserTokenConst.UserRouterToken);
		const routeRegister: IRouteRegister<IUserRouter> = this.container.resolve(RouterTokenConst.RouteRegisterToken);

		routeRegister.registerRouter(userRouter);
	}
}
