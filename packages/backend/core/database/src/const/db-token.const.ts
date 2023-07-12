import { Token } from "iocc";
import type { Sequelize } from "sequelize-typescript";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IDbConnector, IDbManager } from "@/backend-core/database/interface/db";
import type { IMigrationRunner } from "@/backend-core/database/interface/migration";
import type { ISeederRunner } from "@/backend-core/database/interface/seeder";

export class DbTokenConst {
	public static readonly DbManagerToken: Token<IDbManager> = new Token<IDbManager>("DbManager");
	public static readonly MigrationRunnerToken: Token<IMigrationRunner> = new Token<IMigrationRunner>("MigrationRunner");
	public static readonly SeederRunnerToken: Token<ISeederRunner> = new Token<ISeederRunner>("SeederRunner");
	public static readonly DbConnectorToken: Token<IDbConnector<Sequelize>> = new Token<IDbConnector<Sequelize>>("DbConnector");
	public static readonly TransactionManagerToken: Token<ITransactionManager> = new Token<ITransactionManager>("TransactionManager");
}
