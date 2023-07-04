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
	DB_HOST: "DB_HOST";
	DB_PORT: "DB_PORT";
	DB_USER: "DB_USER";
	DB_PASS: "DB_PASS";
	DB_MIGRATION_PASS: "DB_MIGRATION_PASS";

	// Auth
	GOOGLE_CLIENT_ID: "GOOGLE_CLIENT_ID";
	FACEBOOK_CLIENT_ID: "FACEBOOK_CLIENT_ID";
	FACEBOOK_CLIENT_SECRET: "FACEBOOK_CLIENT_SECRET";
	REDIRECT_URL: "REDIRECT_URL";
	TOKEN_EXPIRY: "TOKEN_EXPIRY";
}

export class Config {
	public static get<T extends Key<IConfig>>(name: T): string {
		return <string>process.env[name];
	}

	public static isLocal(stage: string): boolean {
		return !["prod", "qa", "uat"].includes(stage);
	}
}
