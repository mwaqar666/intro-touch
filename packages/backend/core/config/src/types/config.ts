export interface IAuthConfig {
	readonly googleClientId: string;
	readonly googleRedirectUrl: string;
}

export interface IAppConfig {
	readonly env: string;
	readonly name: string;
	readonly version: string;
}

export interface IDatabaseConfig {
	readonly databaseName: string;
	readonly databaseHost: string;
	readonly databasePort: number;
	readonly databaseUser: string;
	readonly databasePass: string;
}

export interface IConfig {
	app: IAppConfig;
	auth: IAuthConfig;
	database: IDatabaseConfig;
}
