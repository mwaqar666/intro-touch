import { Token } from "iocc";
import type { IDbConnector } from "@/backend-core/database/interface";

export class DbTokenConst {
	public static readonly DbConnectorToken: Token<IDbConnector> = new Token<IDbConnector>("DbConnector");
}
