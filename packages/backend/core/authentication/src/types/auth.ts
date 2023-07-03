import type { BaseEntity } from "@/backend-core/database/entity";

export interface IAuthParams<T extends BaseEntity<T>> {
	auth: T;
}
