import type { Key } from "@/stacks/types";

export interface IConfig {
	// App
	APP_NAME: "APP_NAME";
	APP_VERSION: "APP_VERSION";

	// Account
	AWS_REGION: "AWS_REGION";

	// Database
	DB_NAME: "DB_NAME";
	DB_USER: "DB_USER";
	DB_PORT: "DB_PORT";
}

export class Config {
	public static get<T extends Key<IConfig>>(name: T): string {
		return <string>process.env[name];
	}
}
