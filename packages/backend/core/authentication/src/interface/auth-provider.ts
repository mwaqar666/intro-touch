import type { WhereOptions } from "sequelize";
import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthEntity } from "@/backend-core/authentication/types";

export interface IAuthProvider {
	/**
	 * Use the specified authentication driver.
	 */
	useAuthDriver(driver: AuthDriver): Promise<IAuthProvider>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified primary key.
	 */
	retrieveByPrimaryKey(primaryKey: number): Promise<IAuthEntity>;

	/**
	 * Retrieve an instance of IAuthenticatable using the following credentials.
	 * Do not perform password validation here.
	 */
	retrieveByCredentials<TCredentials extends WhereOptions<IAuthEntity>>(credentials: TCredentials): Promise<IAuthEntity>;
}
