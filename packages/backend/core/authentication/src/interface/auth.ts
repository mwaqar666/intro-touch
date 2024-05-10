import type { Nullable } from "@/stacks/types";
import type { WhereOptions } from "sequelize";
import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthenticatableEntity, INonNullableAuthEntityOptions, INullableAuthEntityOptions } from "@/backend-core/authentication/types";

export interface ISendPasswordResetToken {
	userEmail: string;
}

export interface ISaveNewPassword {
	userNewPassword: string;

	userConfirmNewPassword: string;
}

export interface IChangePassword extends ISaveNewPassword {
	userOldPassword: string;
}

export interface IResetPassword extends ISaveNewPassword {
	userEmail: string;

	tokenIdentifier: string;
}

export interface IAuthenticatable {
	/**
	 * Retrieve the authenticatable primary key
	 */
	getAuthPrimaryKey(): number;

	/**
	 * Retrieve the authenticatable uuid
	 */
	getAuthUuidIdentifier(): string;

	/**
	 * Retrieve the authenticatable email
	 */
	getAuthEmailIdentifier(): string;

	/**
	 * Retrieve the authenticatable password
	 */
	getAuthPassword(): Nullable<string>;

	/**
	 * Verify the hashed password of authenticatable against a plain password
	 */
	verifyPassword(plainPassword: string): Promise<void>;
}

export interface IPasswordManager {
	/**
	 * Send the password reset token to the authenticatable
	 */
	sendPasswordResetToken(sendPasswordResetToken: ISendPasswordResetToken): Promise<boolean>;

	/**
	 * Reset the authenticatable password using the password reset token
	 */
	resetPassword(resetPassword: IResetPassword): Promise<IAuthenticatable>;

	/**
	 * Change the password of authenticatable
	 */
	changePassword(authenticatable: IAuthenticatable, changePassword: IChangePassword): Promise<IAuthenticatable>;

	/**
	 * Validates if the user new password is same as user confirmed new password and persist in the database.
	 */
	saveNewPassword(authenticatable: IAuthenticatable, saveNewPassword: ISaveNewPassword): Promise<IAuthenticatable>;
}

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
	retrieveByUuidIdentifier<TAuthEntity extends IAuthenticatableEntity>(uuidIdentifier: string, options?: INullableAuthEntityOptions): Promise<Nullable<TAuthEntity>>;

	/**
	 * Retrieve an instance of IAuthenticatable using the specified UUID.
	 */
	retrieveByUuidIdentifier<TAuthEntity extends IAuthenticatableEntity>(uuidIdentifier: string, options: INonNullableAuthEntityOptions): Promise<TAuthEntity>;

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
