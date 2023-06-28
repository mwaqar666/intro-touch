export interface IAuthConfig {
	readonly googleClientId: string;
	readonly googleRedirectUrl: string;
}

export interface IAppConfig {
	readonly env: string;
	readonly name: string;
	readonly version: string;
	readonly key: string;
}

export interface IDatabaseConfig {
	readonly databaseName: string;
	readonly databaseHost: string;
	readonly databasePort: number;
	readonly databaseUser: string;
	readonly databasePass: string;
	readonly databaseMigrationPass: string;
}

export interface IConfig {
	readonly app: IAppConfig;
	readonly auth: IAuthConfig;
	readonly database: IDatabaseConfig;
}
