import { Token } from "iocc";
import type { Sequelize } from "sequelize-typescript";
import type { IDbConnector, IEntityManager } from "@/backend-core/database/interface";
import type { ITransactionManager } from "@/backend-core/database/interface/transaction-manager";

export class DbTokenConst {
	public static readonly EntityManagerToken: Token<IEntityManager> = new Token<IEntityManager>("EntityManager");
	public static readonly DbConnectorToken: Token<IDbConnector<Sequelize>> = new Token<IDbConnector<Sequelize>>("DbConnector");
	public static readonly TransactionManagerToken: Token<ITransactionManager> = new Token<ITransactionManager>("TransactionManager");
}
