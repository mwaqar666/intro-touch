import { env } from "node:process";
import type { Key } from "@/stacks/types";

export interface IConfig {
	// Database
	DATABASE_NAME: "DATABASE_NAME";

	// Authentication
	GOOGLE_CLIENT_ID: "GOOGLE_CLIENT_ID";
}

export class Config {
	public static get<T extends Key<IConfig>>(name: T): string {
		return <string>env[name];
	}
}
