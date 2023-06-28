import type { Key } from "@/stacks/types";

export interface IConfig {
	// App
	APP_NAME: "APP_NAME";
	APP_VERSION: "APP_VERSION";
	APP_DOMAIN: "APP_DOMAIN";
	APP_KEY: "APP_KEY";

	// Account
	AWS_REGION: "AWS_REGION";

	// Database
	DB_NAME: "DB_NAME";
	DB_USER: "DB_USER";
	DB_PORT: "DB_PORT";
	DB_MIGRATION_PASS: "DB_MIGRATION_PASS";

	// Auth
	GOOGLE_CLIENT_ID: "GOOGLE_CLIENT_ID";
	GOOGLE_REDIRECT_URL: "GOOGLE_REDIRECT_URL";
}

export class Config {
	public static get<T extends Key<IConfig>>(name: T): string {
		return <string>process.env[name];
	}
}
