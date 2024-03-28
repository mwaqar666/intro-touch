import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { IndustryController } from "@/backend/industry/controllers";
import { IndustryDbRegister } from "@/backend/industry/db/industry-db.register";
import { IndustryRouter } from "@/backend/industry/router";
import { IndustryService } from "@/backend/industry/services";

export class IndustryModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Controllers
		this.container.registerSingleton(IndustryController);

		// Services
		this.container.registerSingleton(IndustryService);

		// Database
		DbExtension.registerDb(IndustryDbRegister);
	}

	public override async boot(): Promise<void> {
		// Routing
		RouterExtension.addRouter(IndustryRouter);
	}
}
