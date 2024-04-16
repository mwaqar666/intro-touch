import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbExtension } from "@/backend-core/database/extensions";
import { RouterExtension } from "@/backend-core/router/extensions";
import { AnalyticsController } from "@/backend/analytics/controllers";
import { AnalyticsDbRegister } from "@/backend/analytics/db/analytics-db.register";
import { AnalyticsResponseInterceptor } from "@/backend/analytics/interceptors/response";
import { AnalyticsRouter } from "@/backend/analytics/router";
import { CustomPlatformAnalyticsService, PlatformAnalyticsService } from "@/backend/analytics/services";

export class AnalyticsModule extends AbstractModule {
	public override async register(): Promise<void> {
		// Controllers
		this.container.registerSingleton(AnalyticsController);

		// Interceptors
		this.container.registerSingleton(AnalyticsResponseInterceptor);

		// Services
		this.container.registerSingleton(PlatformAnalyticsService);
		this.container.registerSingleton(CustomPlatformAnalyticsService);

		// Database
		DbExtension.registerDb(AnalyticsDbRegister);
	}

	public override async boot(): Promise<void> {
		// Router
		RouterExtension.addRouter(AnalyticsRouter);
	}
}
