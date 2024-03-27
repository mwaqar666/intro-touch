import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthenticatableRepository } from "@/backend-core/authentication/types";
import type { StorageDriver } from "@/backend-core/storage/enums";
import type { Constructable } from "@/stacks/types";

export interface IAppConfig {
	readonly env: string;
	readonly name: string;
	readonly version: string;
	readonly region: string;
	readonly key: string;
}

export interface IAuthDriverConfig {
	readonly repository: Promise<Constructable<IAuthenticatableRepository>>;
}

export type IAuthDrivers = {
	readonly [Key in AuthDriver]: IAuthDriverConfig;
};

export interface IAuthConfig {
	readonly googleClientId: string;
	readonly facebookClientId: string;
	readonly facebookClientSecret: string;
	readonly redirectUrl: string;
	readonly tokenExpiry: string;
	readonly authDrivers: IAuthDrivers;
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

export interface IStorageConfig {
	readonly driver: StorageDriver;
}

export interface IConfig {
	readonly app: IAppConfig;
	readonly auth: IAuthConfig;
	readonly email: IEmailConfig;
	readonly frontend: IFrontendConfig;
	readonly database: IDatabaseConfig;
	readonly storage: IStorageConfig;
}
