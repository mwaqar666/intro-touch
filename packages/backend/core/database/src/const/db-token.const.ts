import { Token } from "iocc";
import type { Sequelize } from "sequelize-typescript";
import type { IDbConnector, IDbManager, IMigrationRunner, ITransactionManager } from "@/backend-core/database/interface";

export class DbTokenConst {
	public static readonly DbManagerToken: Token<IDbManager> = new Token<IDbManager>("DbManager");
	public static readonly MigrationRunnerToken: Token<IMigrationRunner> = new Token<IMigrationRunner>("MigrationRunner");
	public static readonly DbConnectorToken: Token<IDbConnector<Sequelize>> = new Token<IDbConnector<Sequelize>>("DbConnector");
	public static readonly TransactionManagerToken: Token<ITransactionManager> = new Token<ITransactionManager>("TransactionManager");
}
