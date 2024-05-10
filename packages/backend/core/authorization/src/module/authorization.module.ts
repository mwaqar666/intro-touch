import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { AuthorizationDbRegister } from "@/backend-core/authorization/db/authorization-db.register";
import { AuthorizationService, RoleService } from "@/backend-core/authorization/services";

export class AuthorizationModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Services
		this.container.registerSingleton(AuthorizationTokenConst.Authorization, AuthorizationService);

		this.container.registerSingleton(RoleService);

		// Database
		DbExtension.registerDb(AuthorizationDbRegister);
	}
}
