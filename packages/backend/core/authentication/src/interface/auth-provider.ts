import type { Nullable } from "@/stacks/types";
import type { WhereOptions } from "sequelize";
import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthenticatableEntity, INonNullableAuthEntityOptions, INullableAuthEntityOptions } from "@/backend-core/authentication/types";

export interface IAuthProvider {
	/**
	 * Use the specified authentication driver.
	 */
	useAuthDriver(driver: AuthDriver): Promise<IAuthProvider>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified primary key.
	 */
	retrieveByPrimaryKey<TAuthEntity extends IAuthenticatableEntity>(primaryKey: number, options?: INullableAuthEntityOptions): Promise<Nullable<TAuthEntity>>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified primary key.
	 */
	retrieveByPrimaryKey<TAuthEntity extends IAuthenticatableEntity>(primaryKey: number, options: INonNullableAuthEntityOptions): Promise<TAuthEntity>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified UUID.
	 */
	retrieveByUuid<TAuthEntity extends IAuthenticatableEntity>(uuid: string, options?: INullableAuthEntityOptions): Promise<Nullable<TAuthEntity>>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified UUID.
	 */
	retrieveByUuid<TAuthEntity extends IAuthenticatableEntity>(uuid: string, options: INonNullableAuthEntityOptions): Promise<TAuthEntity>;

	/**
	 * Retrieve an instance of IAuthenticatable using the following credentials.
	 * Do not perform password validation here.
	 */
	retrieveByCredentials<TAuthEntity extends IAuthenticatableEntity>(credentials: WhereOptions<TAuthEntity>, options?: INullableAuthEntityOptions): Promise<Nullable<TAuthEntity>>;

	/**
	 * Retrieve an instance of IAuthenticatable using the following credentials.
	 * Do not perform password validation here.
	 */
	retrieveByCredentials<TAuthEntity extends IAuthenticatableEntity>(credentials: WhereOptions<TAuthEntity>, options: INonNullableAuthEntityOptions): Promise<TAuthEntity>;
}
