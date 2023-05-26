import { AbstractModule } from "@/backend/core/concrete/module";
import { RouterTokenConst } from "@/backend/router/const";
import { UserTokenConst } from "@/backend/user/const";
import { UserController } from "@/backend/user/controller";
import { userRoutes } from "@/backend/user/routes";

export class UserModule extends AbstractModule {
	public register(): void {
		this.container.set(UserTokenConst.UserControllerToken, { type: UserController });
		this.container.push(RouterTokenConst.RouteToken, { value: userRoutes });
	}

	public boot(): void {
		//
	}
}
