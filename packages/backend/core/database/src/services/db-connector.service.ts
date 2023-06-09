import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAccountConfig, IAppConfigResolver, IDatabaseConfig } from "@/backend-core/config/types";
import { RDSData } from "@aws-sdk/client-rds-data";
import { fromIni } from "@aws-sdk/credential-providers";
import { Inject } from "iocc";
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import type { IDbConnector } from "@/backend-core/database/interface";
import type { IDatabase } from "@/backend-core/database/types";

export class DbConnectorService implements IDbConnector<IDatabase> {
	private rdsClient: Kysely<IDatabase>;

	public constructor(
		// Dependencies
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async connectToDatabase(): Promise<void> {
		const dbConfig: IDatabaseConfig = this.configResolver.resolveConfig("database");
		const accountConfig: IAccountConfig = this.configResolver.resolveConfig("account");

		this.rdsClient = new Kysely({
			dialect: new DataApiDialect({
				mode: "postgres",
				driver: {
					secretArn: dbConfig.secretArn,
					resourceArn: dbConfig.resourceArn,
					database: dbConfig.database,
					client: new RDSData({
						credentials: fromIni({ profile: accountConfig.profile }),
					}),
				},
			}),
		});
	}

	public async releaseDatabaseConnection(): Promise<void> {
		await this.rdsClient.destroy();
	}

	public getDatabaseConnection(): Kysely<IDatabase> {
		return this.rdsClient;
	}
}
