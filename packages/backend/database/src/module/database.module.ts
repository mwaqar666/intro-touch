import { AbstractModule } from "@/backend/core/concrete/module";
import { DbTokenConst } from "@/backend/database/const";
import type { IDbConnector } from "@/backend/database/interface";
import { DbConnectorService } from "@/backend/database/services";

export class DatabaseModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(DbTokenConst.DbConnectorToken, DbConnectorService);
	}

	public override async preRun(): Promise<void> {
		const dbConnector: IDbConnector = this.container.resolve(DbTokenConst.DbConnectorToken);

		await dbConnector.connectToDatabase();
	}

	public override async postRun(): Promise<void> {
		const dbConnector: IDbConnector = this.container.resolve(DbTokenConst.DbConnectorToken);

		await dbConnector.connectToDatabase();
	}
}
