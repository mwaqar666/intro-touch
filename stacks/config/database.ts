import * as process from "process";

export class DatabaseConfig {
	public static readonly DATABASE_NAME: string = <string>process.env["DATABASE_NAME"];
}
