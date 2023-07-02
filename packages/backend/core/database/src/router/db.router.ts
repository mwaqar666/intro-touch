import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { MigrationController } from "@/backend-core/database/controllers";
import { MigrationRunnerGuard } from "@/backend-core/database/guards";

export class DbRouter implements IRouter {
	public constructor(
		// Dependencies
		@Inject(MigrationController) private readonly migrationController: MigrationController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "__database",
				guards: [MigrationRunnerGuard],
				routes: [
					{
						path: "migration/up",
						method: RouteMethod.GET,
						handler: this.migrationController.runMigrations,
					},
					{
						path: "migration/down",
						method: RouteMethod.GET,
						handler: this.migrationController.revertMigrations,
					},
				],
			},
		];
	}
}
