import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouteRegister } from "@/backend-core/router/interface";
import type { Sequelize } from "sequelize-typescript";
import { DbTokenConst } from "@/backend-core/database/const";
import { MigrationController } from "@/backend-core/database/controllers";
import type { IDbConnector } from "@/backend-core/database/interface";
import { DbRouter } from "@/backend-core/database/router";
import { DbConnectorService, DbManagerService, MigrationRunnerService, TransactionManagerService } from "@/backend-core/database/services";

export class DatabaseModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(DbRouter);
		this.container.registerSingleton(MigrationController);

		this.container.registerSingleton(DbTokenConst.DbConnectorToken, DbConnectorService);
		this.container.registerSingleton(DbTokenConst.DbManagerToken, DbManagerService);
		this.container.registerSingleton(DbTokenConst.MigrationRunnerToken, MigrationRunnerService);
		this.container.registerSingleton(DbTokenConst.TransactionManagerToken, TransactionManagerService);
	}

	public override async boot(): Promise<void> {
		const dbRouter: DbRouter = this.container.resolve(DbRouter);
		const routeRegister: IRouteRegister = this.container.resolve(RouterTokenConst.RouteRegisterToken);
		routeRegister.registerRouter(dbRouter);
	}

	public override async preRun(): Promise<void> {
		const dbConnector: IDbConnector<Sequelize> = this.container.resolve(DbTokenConst.DbConnectorToken);

		await dbConnector.connectToDatabase();
	}

	public override async postRun(): Promise<void> {
		const dbConnector: IDbConnector<Sequelize> = this.container.resolve(DbTokenConst.DbConnectorToken);

		await dbConnector.releaseDatabaseConnection();
	}
}
