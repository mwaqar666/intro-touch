import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IEntityManager } from "@/backend-core/database/interface";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouteRegister } from "@/backend-core/router/interface";
import { PlatformDbRegister } from "@/backend/platform/db/platform-db.register";
import { PlatformRouter } from "@/backend/platform/router";

export class PlatformModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(PlatformRouter);
		this.container.registerSingleton(PlatformDbRegister);
	}

	public override async boot(): Promise<void> {
		const platformRouter: PlatformRouter = this.container.resolve(PlatformRouter);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		routeRegister.registerRouter(platformRouter);

		const platformDbRegister: PlatformDbRegister = this.container.resolve(PlatformDbRegister);
		const entityManager: IEntityManager = this.container.resolve(DbTokenConst.EntityManagerToken);
		entityManager.registerEntities(platformDbRegister);
	}
}
