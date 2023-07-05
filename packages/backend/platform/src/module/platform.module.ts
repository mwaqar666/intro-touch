import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { PlatformDbRegister } from "@/backend/platform/db/platform-db.register";
import { PlatformRouter } from "@/backend/platform/router";

export class PlatformModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(PlatformRouter);
		this.container.registerSingleton(PlatformDbRegister);
	}

	public override async boot(): Promise<void> {
		DbExtension.registerDb(PlatformDbRegister);

		RouterExtension.registerRouter(PlatformRouter);
	}
}
