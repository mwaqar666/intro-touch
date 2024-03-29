import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { CustomPlatformController, PlatformCategoryController, PlatformController, PlatformProfileController } from "@/backend/platform/controller";
import { PlatformDbRegister } from "@/backend/platform/db/platform-db.register";
import { PlatformRouter } from "@/backend/platform/router";
import { CustomPlatformService, PlatformCategoryService, PlatformProfileService, PlatformService } from "@/backend/platform/services";

export class PlatformModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(PlatformController);
		this.container.registerSingleton(CustomPlatformController);
		this.container.registerSingleton(PlatformCategoryController);
		this.container.registerSingleton(PlatformProfileController);

		// Services
		this.container.registerSingleton(PlatformService);
		this.container.registerSingleton(CustomPlatformService);
		this.container.registerSingleton(PlatformCategoryService);
		this.container.registerSingleton(PlatformProfileService);

		// Database
		DbExtension.registerDb(PlatformDbRegister);
	}

	public override async boot(): Promise<void> {
		// Routing
		RouterExtension.addRouter(PlatformRouter);
	}
}
