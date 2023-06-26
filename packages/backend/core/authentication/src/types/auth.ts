import type { UserEntity } from "@/backend/user/db/entities";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { Nullable } from "@/stacks/types";

export interface IAuthEntityLookUpResponse {
	entity: UserEntity;
	created: boolean;
}

export interface IAuthEntityLookUpRequest {
	userEmail: string;
	userFirstName: Nullable<string>;
	userLastName: Nullable<string>;
}

export interface IAuthParams<T extends BaseEntity<T>> {
	auth: T;
}
