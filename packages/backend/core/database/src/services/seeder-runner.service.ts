import { Inject } from "iocc";
import type { Sequelize } from "sequelize-typescript";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector, IDbManager } from "@/backend-core/database/interface/db";
import type { ISeeder, ISeederRunner } from "@/backend-core/database/interface/seeder";

export class SeederRunnerService implements ISeederRunner {
	public constructor(
		// Dependencies
		@Inject(DbTokenConst.DbManagerToken) private readonly dbManager: IDbManager,
		@Inject(DbTokenConst.DbConnectorToken) private readonly dbConnector: IDbConnector<Sequelize>,
	) {}

	public async runSeeders(): Promise<Array<string>> {
		await this.truncateDatabase();

		const dbSeeders: Array<ISeeder> = this.gatherDatabaseSeeders();
		const seedersRan: Array<string> = [];

		for (const dbSeeder of dbSeeders) {
			await dbSeeder.seed();

			seedersRan.push(dbSeeder.constructor.name);
		}

		return seedersRan;
	}

	private async truncateDatabase(): Promise<void> {
		const sequelize: Sequelize = this.dbConnector.getDatabaseConnection();

		await sequelize.truncate({
			cascade: true,
			restartIdentity: true,
			force: true,
		});
	}

	private gatherDatabaseSeeders(): Array<ISeeder> {
		const dbSeeders: Array<ISeeder> = this.dbManager.resolveSeeders();

		return dbSeeders.sort((seederFirst: ISeeder, seederSecond: ISeeder) => {
			return seederFirst.timestamp - seederSecond.timestamp;
		});
	}
}
