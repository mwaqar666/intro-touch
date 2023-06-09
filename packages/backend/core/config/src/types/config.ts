export interface IAppConfig {
	readonly name: string;
	readonly env: string;
	readonly version: string;
}

export interface IAwsConfig {
	readonly account: string;
}

export interface IDatabaseConfig {
	readonly database: string;
	readonly databaseUser: string;
	readonly secretArn: string;
	readonly resourceArn: string;
}

export interface IConfig {
	app: IAppConfig;
	aws: IAwsConfig;
	database: IDatabaseConfig;
}
