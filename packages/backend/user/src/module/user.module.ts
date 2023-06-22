import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IEntityManager } from "@/backend-core/database/interface";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouteRegister } from "@/backend-core/router/interface";
import { UserController } from "@/backend/user/controller";
import { UserDbRegister } from "@/backend/user/db/user-db.register";
import { UserRouter } from "@/backend/user/router";
import { UserService } from "@/backend/user/services";

export class UserModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(UserService);
		this.container.registerSingleton(UserController);
		this.container.registerSingleton(UserRouter);
		this.container.registerSingleton(UserDbRegister);
	}

	public override async boot(): Promise<void> {
		const userRouter: UserRouter = this.container.resolve(UserRouter);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		routeRegister.registerRouter(userRouter);

		const userDbRegister: UserDbRegister = this.container.resolve(UserDbRegister);
		const entityManager: IEntityManager = this.container.resolve(DbTokenConst.EntityManagerToken);
		entityManager.registerEntities(userDbRegister);
	}
}
