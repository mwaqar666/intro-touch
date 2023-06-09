import { Token } from "iocc";
import type { IDbConnector } from "@/backend-core/database/interface";
import type { IDatabase } from "@/backend-core/database/types";

export class DbTokenConst {
	public static readonly DbConnectorToken: Token<IDbConnector<IDatabase>> = new Token<IDbConnector<IDatabase>>("DbConnector");
}
