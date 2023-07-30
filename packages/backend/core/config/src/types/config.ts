export interface IAuthConfig {
	readonly googleClientId: string;
	readonly facebookClientId: string;
	readonly facebookClientSecret: string;
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

export interface IFrontendConfig {
	readonly url: string;
}

export interface IDatabaseConfig {
	readonly databaseName: string;
	readonly databaseHost: string;
	readonly databasePort: number;
	readonly databaseUser: string;
	readonly databasePass: string;
	readonly databaseToken: string;
}

export interface IConfig {
	readonly app: IAppConfig;
	readonly auth: IAuthConfig;
	readonly email: IEmailConfig;
	readonly frontend: IFrontendConfig;
	readonly database: IDatabaseConfig;
}
