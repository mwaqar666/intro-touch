import { Token } from "iocc";
import type { Sequelize } from "sequelize-typescript";
import type { IDbConnector } from "@/backend-core/database/interface";

export class DbTokenConst {
	public static readonly DbConnectorToken: Token<IDbConnector<Sequelize>> = new Token<IDbConnector<Sequelize>>("DbConnector");
}
