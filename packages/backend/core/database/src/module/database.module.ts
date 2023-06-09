import { AbstractModule } from "@/backend-core/core/concrete/module";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector } from "@/backend-core/database/interface";
import { DbConnectorService } from "@/backend-core/database/services";
import type { IDatabase } from "@/backend-core/database/types";

export class DatabaseModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(DbTokenConst.DbConnectorToken, DbConnectorService);
	}

	public override async preRun(): Promise<void> {
		const dbConnector: IDbConnector<IDatabase> = this.container.resolve(DbTokenConst.DbConnectorToken);

		await dbConnector.connectToDatabase();
	}

	public override async postRun(): Promise<void> {
		const dbConnector: IDbConnector<IDatabase> = this.container.resolve(DbTokenConst.DbConnectorToken);

		await dbConnector.releaseDatabaseConnection();
	}
}
