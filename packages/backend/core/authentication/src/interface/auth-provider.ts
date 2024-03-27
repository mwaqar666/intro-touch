import type { IEntityScope } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import type { WhereOptions } from "sequelize";
import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";

export interface IAuthProvider {
	/**
	 * Use the specified authentication driver.
	 */
	useAuthDriver(driver: AuthDriver): Promise<IAuthProvider>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified primary key.
	 */
	retrieveByPrimaryKey(primaryKey: number, scopes?: IEntityScope): Promise<Nullable<IAuthenticatableEntity>>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified UUID.
	 */
	retrieveByUuid(uuid: string, scopes?: IEntityScope): Promise<Nullable<IAuthenticatableEntity>>;

	/**
	 * Retrieve an instance of IAuthenticatable using the following credentials.
	 * Do not perform password validation here.
	 */
	retrieveByCredentials<TCredentials extends WhereOptions<IAuthenticatableEntity>>(credentials: TCredentials, scopes?: IEntityScope): Promise<Nullable<IAuthenticatableEntity>>;
}
