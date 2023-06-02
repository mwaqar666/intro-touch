export interface IAppConfig {
	readonly name: string;
	readonly env: string;
	readonly version: string;
}

export interface IDatabaseConfig {
	readonly name: string;
	readonly schema: string;
	readonly host: string;
	readonly port: number;
	readonly user: string;
	readonly pass: string;
}

export interface IConfig {
	app: IAppConfig;
	database: IDatabaseConfig;
}
