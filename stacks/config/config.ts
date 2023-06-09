import type { Key } from "@/stacks/types";

export interface IConfig {
	// App
	APP_NAME: "APP_NAME";
	APP_REGION: "APP_REGION";
	APP_VERSION: "APP_VERSION";

	// Database
	DB_NAME: "DB_NAME";
	DB_USER: "DB_USER";

	// Account
	AWS_PROFILE: "AWS_PROFILE";

	// Authentication
	GOOGLE_CLIENT_ID: "GOOGLE_CLIENT_ID";
}

export class Config {
	public static get<T extends Key<IConfig>>(name: T): string {
		return <string>process.env[name];
	}
}
