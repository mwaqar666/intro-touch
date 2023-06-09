import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouter, IRouteRegister } from "@/backend-core/router/interface";
import { UserTokenConst } from "@/backend/user/const";
import { UserController } from "@/backend/user/controller";
import { UserRepository } from "@/backend/user/repository";
import { UserRouter } from "@/backend/user/router";
import { UserService } from "@/backend/user/services";

export class UserModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(UserTokenConst.UserServiceToken, UserService);
		this.container.registerSingleton(UserTokenConst.UserControllerToken, UserController);
		this.container.registerSingleton(UserTokenConst.UserRepositoryToken, UserRepository);
		this.container.registerSingleton(UserTokenConst.UserRouterToken, UserRouter);
	}

	public override async boot(): Promise<void> {
		const userRouter: IRouter = this.container.resolve(UserTokenConst.UserRouterToken);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);

		routeRegister.registerRouter(userRouter);
	}
}
