export interface IAppConfig {
	readonly name: string;
	readonly env: string;
	readonly version: string;
}

export interface IDatabaseConfig {
	readonly database: string;
	readonly schema: string;
	readonly host: string;
	readonly port: number;
	readonly username: string;
	readonly password: string;
}

export interface IConfig {
	app: IAppConfig;
	database: IDatabaseConfig;
}
