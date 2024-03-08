import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { MigrationController, SeedingController } from "@/backend-core/database/controllers";
import { DbRunnerGuard } from "@/backend-core/database/guards";

export class DbRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(SeedingController) private readonly seedingController: SeedingController,
		@Inject(MigrationController) private readonly migrationController: MigrationController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "__database",
				guards: [DbRunnerGuard],
				routes: [
					{
						path: "migration/up",
						method: RouteMethod.POST,
						handler: this.migrationController.runMigrations,
					},
					{
						path: "migration/down",
						method: RouteMethod.POST,
						handler: this.migrationController.revertMigrations,
					},
					{
						path: "seed",
						method: RouteMethod.POST,
						handler: this.seedingController.seed,
					},
				],
			},
		];
	}
}
