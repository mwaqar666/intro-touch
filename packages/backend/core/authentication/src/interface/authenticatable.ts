import type { BaseEntity } from "@/backend-core/database/entity";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Key, Nullable } from "@/stacks/types";

export interface IAuthenticatable<T extends BaseEntity<T>> {
	/**
	 * The name of the “primary key” column
	 */
	getAuthIdentifierName(): Key<IEntityTableColumnProperties<T>>;

	/**
	 * The “primary key” of the user
	 */
	getAuthIdentifier(): number;

	/**
	 * The name of the user password column
	 */
	getAuthPasswordName(): Key<IEntityTableColumnProperties<T>>;

	/**
	 * The user hashed password
	 */
	getAuthPassword(): Nullable<string>;
}
