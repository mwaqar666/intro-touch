import { ConfigTokenConst } from "@/backend/config/const";
import type { IAppConfigResolver, IDatabaseConfig } from "@/backend/config/types";
import { Inject } from "iocc";
import { Sequelize } from "sequelize-typescript";
import type { IDbConnector } from "@/backend/database/interface";

export class DbConnectorService implements IDbConnector {
	private sequelizeInstance: Sequelize;

	public constructor(
		// Dependencies
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async connectToDatabase(): Promise<void> {
		try {
			await this.prepareSequelizeInstance(this.sequelizeInstance);
		} catch (exception) {
			throw new Error(`Error connecting database: ${exception}`);
		}
	}

	public async releaseDatabaseConnection(): Promise<void> {
		// Close any opened connections during the invocation
		// This will wait for any in-progress queries to finish before closing the connections
		await this.sequelizeInstance.connectionManager.close();
	}

	private async prepareSequelizeInstance(sequelize: Sequelize): Promise<Sequelize> {
		// Re-use the sequelize instance across invocations to improve performance
		if (!sequelize) return await this.createDatabaseConnection();

		// Restart connection pool to ensure connections are not re used across invocations
		sequelize.connectionManager.initPools();

		// Restore `get connection()` if it has been overwritten by `close()`
		const hasGetConnectionProperty: boolean = Object.prototype.hasOwnProperty.call(sequelize.connectionManager, "getConnection");
		if (hasGetConnectionProperty) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			delete sequelize.connectionManager.getConnection;
		}

		return sequelize;
	}

	private async createDatabaseConnection(): Promise<Sequelize> {
		const databaseConfig: IDatabaseConfig = this.configResolver.resolveConfig("database");

		const sequelize: Sequelize = new Sequelize({
			...databaseConfig,
			pool: {
				max: 2,
				min: 0,
				idle: 0,
				acquire: 3000,
			},
		});

		await sequelize.authenticate({});

		return sequelize;
	}
}
