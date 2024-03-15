import type { BaseEntity } from "@/backend-core/database/entity";
import type { Permission } from "@/backend-core/authorization/enums";

export interface IAuthorizable {
	can<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<boolean>;

	canAny<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<boolean>;

	cannot<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<boolean>;

	cannotAny<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<boolean>;

	authorize<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<void>;

	authorizeAny<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<void>;

	prohibit<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<void>;

	prohibitAny<T extends BaseEntity<T>>(permissions: Array<Permission>, resource: T): Promise<void>;
}
