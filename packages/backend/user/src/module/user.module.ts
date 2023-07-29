import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { UserController, UserProfileController } from "@/backend/user/controller";
import { UserDbRegister } from "@/backend/user/db/user-db.register";
import { UserRouter } from "@/backend/user/router";
import { UserAuthService, UserProfileService, UserService } from "@/backend/user/services";

export class UserModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(UserController);
		this.container.registerSingleton(UserProfileController);

		// Services
		this.container.registerSingleton(UserService);
		this.container.registerSingleton(UserAuthService);
		this.container.registerSingleton(UserProfileService);

		// Database
		DbExtension.registerDb(UserDbRegister);
	}

	public override async boot(): Promise<void> {
		// Routing
		RouterExtension.addRouter(UserRouter);
	}
}
