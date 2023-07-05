import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { PlatformDbRegister } from "@/backend/platform/db/platform-db.register";
import { PlatformRouter } from "@/backend/platform/router";

export class PlatformModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Database
		DbExtension.registerDb(PlatformDbRegister);
	}

	public override async boot(): Promise<void> {
		// Routing
		RouterExtension.addRouter(PlatformRouter);
	}
}
