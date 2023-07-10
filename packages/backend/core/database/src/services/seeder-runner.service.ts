import { Inject } from "iocc";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbManager } from "@/backend-core/database/interface/db";
import type { ISeeder, ISeederRunner } from "@/backend-core/database/interface/seeder";

export class SeederRunnerService implements ISeederRunner {
	public constructor(
		// Dependencies
		@Inject(DbTokenConst.DbManagerToken) private readonly dbManager: IDbManager,
	) {}

	public async runSeeders(): Promise<Array<string>> {
		const dbSeeders: Array<ISeeder> = this.gatherDatabaseSeeders();
		const seedersRan: Array<string> = [];

		for (const dbSeeder of dbSeeders) {
			await dbSeeder.seed();

			seedersRan.push(dbSeeder.constructor.name);
		}

		return seedersRan;
	}

	private gatherDatabaseSeeders(): Array<ISeeder> {
		const dbSeeders: Array<ISeeder> = this.dbManager.resolveSeeders();

		return dbSeeders.sort((seederFirst: ISeeder, seederSecond: ISeeder) => {
			return seederFirst.timestamp - seederSecond.timestamp;
		});
	}
}
