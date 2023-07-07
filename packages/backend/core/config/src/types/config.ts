export interface IAuthConfig {
	readonly googleClientId: string;
	readonly redirectUrl: string;
	readonly tokenExpiry: string;
}

export interface IAppConfig {
	readonly env: string;
	readonly name: string;
	readonly version: string;
	readonly region: string;
	readonly key: string;
}

export interface IEmailConfig {
	readonly emailFrom: string;
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
	readonly email: IEmailConfig;
	readonly database: IDatabaseConfig;
}
