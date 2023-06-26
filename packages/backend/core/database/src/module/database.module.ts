import { AbstractModule } from "@/backend-core/core/concrete/module";
import type { Sequelize } from "sequelize-typescript";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector } from "@/backend-core/database/interface";
import { DbConnectorService, DbManagerService, MigrationRunnerService, TransactionManagerService } from "@/backend-core/database/services";

export class DatabaseModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(DbTokenConst.DbConnectorToken, DbConnectorService);
		this.container.registerSingleton(DbTokenConst.DbManagerToken, DbManagerService);
		this.container.registerSingleton(DbTokenConst.MigrationRunnerToken, MigrationRunnerService);
		this.container.registerSingleton(DbTokenConst.TransactionManagerToken, TransactionManagerService);
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
