import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IDatabaseConfig } from "@/backend-core/config/types";
import { Inject } from "iocc";
import type { ModelCtor } from "sequelize-typescript";
import { Sequelize } from "sequelize-typescript";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector, IEntityManager } from "@/backend-core/database/interface";

export class DbConnectorService implements IDbConnector<Sequelize> {
	private dbConnection: Sequelize;

	public constructor(
		// Dependencies
		@Inject(DbTokenConst.EntityManagerToken) private readonly entityManager: IEntityManager,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async connectToDatabase(): Promise<void> {
		await this.initializeSequelize();
	}

	public async releaseDatabaseConnection(): Promise<void> {
		await this.dbConnection.connectionManager.close();
	}

	public getDatabaseConnection(): Sequelize {
		return this.dbConnection;
	}

	private async initializeSequelize(): Promise<void> {
		if (!this.dbConnection) {
			this.dbConnection = await this.createSequelizeConnection();

			return;
		}

		// restart connection pool to ensure connections are not re-used across invocations
		this.dbConnection.connectionManager.initPools();

		// restore `getConnection()` if it has been overwritten by `close()`
		const hasGetConnectionProp: boolean = Object.prototype.hasOwnProperty.call(this.dbConnection, "getConnection");
		if (hasGetConnectionProp) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			delete this.dbConnection.connectionManager.getConnection;
		}
	}

	private async createSequelizeConnection(): Promise<Sequelize> {
		const dbConfig: IDatabaseConfig = this.configResolver.resolveConfig("database");

		const sequelize: Sequelize = new Sequelize({
			database: dbConfig.databaseName,
			host: dbConfig.databaseHost,
			port: dbConfig.databasePort,
			username: dbConfig.databaseUser,
			password: dbConfig.databasePass,
			dialect: "postgres",
			minifyAliases: true,
			pool: {
				max: 2,
				min: 0,
				idle: 0,
				acquire: 3000,
				evict: 30000,
			},
			models: this.entityManager.resolveEntities() as unknown as Array<ModelCtor>,
		});

		await sequelize.authenticate();

		return sequelize;
	}
}
