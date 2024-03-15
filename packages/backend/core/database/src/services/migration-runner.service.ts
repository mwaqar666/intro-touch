import { Inject } from "iocc";
import type { QueryInterface } from "sequelize";
import type { Sequelize } from "sequelize-typescript";
import type { MigrationMeta, MigrationParams, RunnableMigration } from "umzug";
import { SequelizeStorage, Umzug } from "umzug";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector, IDbManager } from "@/backend-core/database/interface/db";
import type { IMigration, IMigrationRunner } from "@/backend-core/database/interface/migration";

export class MigrationRunnerService implements IMigrationRunner {
	private umzug: Umzug<QueryInterface>;

	public constructor(
		// Dependencies
		@Inject(DbTokenConst.DbManagerToken) private readonly dbManager: IDbManager,
		@Inject(DbTokenConst.DbConnectorToken) private readonly dbConnector: IDbConnector<Sequelize>,
	) {}

	public async runMigrations(): Promise<Array<string>> {
		this.checkUmzugConnection();

		const migrationsRan: Array<MigrationMeta> = await this.umzug.up();

		return migrationsRan.map(({ name }: MigrationMeta): string => name);
	}

	public async revertMigrations(): Promise<Array<string>> {
		this.checkUmzugConnection();

		const migrationsReverted: Array<MigrationMeta> = await this.umzug.down();

		return migrationsReverted.map(({ name }: MigrationMeta): string => name);
	}

	private checkUmzugConnection(): void {
		if (this.umzug) return;

		const sequelize: Sequelize = this.dbConnector.getDatabaseConnection();

		this.umzug = new Umzug<QueryInterface>({
			migrations: this.gatherApplicationMigrations(),
			context: sequelize.getQueryInterface(),
			storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
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
					migration.setQueryInterface(context);

					await migration.up();
				},
				down: async ({ context }: MigrationParams<QueryInterface>): Promise<void> => {
					migration.setQueryInterface(context);

					await migration.down();
				},
			};
		});
	}
}
