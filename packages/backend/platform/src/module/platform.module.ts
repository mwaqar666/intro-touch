import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { PlatformController } from "@/backend/platform/controller";
import { PlatformDbRegister } from "@/backend/platform/db/platform-db.register";
import { PlatformRouter } from "@/backend/platform/router";
import { PlatformService } from "@/backend/platform/services";

export class PlatformModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(PlatformController);

		// Services
		this.container.registerSingleton(PlatformService);

		// Database
		DbExtension.registerDb(PlatformDbRegister);
	}

	public override async boot(): Promise<void> {
		// Routing
		RouterExtension.addRouter(PlatformRouter);
	}
}
