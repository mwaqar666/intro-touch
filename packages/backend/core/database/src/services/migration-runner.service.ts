import { Inject } from "iocc";
import type { QueryInterface } from "sequelize";
import type { Sequelize } from "sequelize-typescript";
import type { MigrationParams } from "umzug";
import { SequelizeStorage, Umzug } from "umzug";
import type { RunnableMigration } from "umzug/lib/types";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector, IDbManager, IMigration, IMigrationRunner } from "@/backend-core/database/interface";
import type { IMigrationRevertOptions } from "@/backend-core/database/types";

export class MigrationRunnerService implements IMigrationRunner {
	private umzug: Umzug<QueryInterface>;

	public constructor(
		// Dependencies
		@Inject(DbTokenConst.DbManagerToken) private readonly dbManager: IDbManager,
		@Inject(DbTokenConst.DbConnectorToken) private readonly dbConnector: IDbConnector<Sequelize>,
	) {}

	public async runMigrations(): Promise<void> {
		this.checkUmzugConnection();

		await this.umzug.up();
	}

	public async revertMigrations(revertMigrationOptions: IMigrationRevertOptions): Promise<void> {
		this.checkUmzugConnection();

		await this.umzug.down({ step: revertMigrationOptions.step });
	}

	private checkUmzugConnection(): void {
		if (this.umzug) return;

		const sequelize: Sequelize = this.dbConnector.getDatabaseConnection();

		this.umzug = new Umzug<QueryInterface>({
			migrations: this.gatherApplicationMigrations(),
			context: sequelize.getQueryInterface(),
			storage: new SequelizeStorage({ sequelize }),
			logger: console,
		});
	}

	private gatherApplicationMigrations(): Array<RunnableMigration<QueryInterface>> {
		const migrations: Array<IMigration> = this.dbManager.resolveMigrations();

		return this.prepareRunnableMigrations(
			migrations.sort((migrationFirst: IMigration, migrationSecond: IMigration) => {
				return migrationFirst.timestamp - migrationSecond.timestamp;
			}),
		);
	}

	private prepareRunnableMigrations(sortedMigrations: Array<IMigration>): Array<RunnableMigration<QueryInterface>> {
		return sortedMigrations.map((migration: IMigration): RunnableMigration<QueryInterface> => {
			return {
				name: `${migration.timestamp}-${migration.constructor.name}`,
				up: async ({ context }: MigrationParams<QueryInterface>): Promise<void> => {
					await migration.up(context);
				},
				down: async ({ context }: MigrationParams<QueryInterface>): Promise<void> => {
					await migration.down(context);
				},
			};
		});
	}
}
