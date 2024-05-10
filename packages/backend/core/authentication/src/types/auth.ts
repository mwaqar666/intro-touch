import type { BaseEntity } from "@/backend-core/database/entity";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityScope } from "@/backend-core/database/types";
import type { IAuthenticatable } from "@/backend-core/authentication/interface";

export type IAuthenticatableEntity = BaseEntity & IAuthenticatable;
export type IAuthenticatableRepository = BaseRepository<IAuthenticatableEntity>;
export type IAuthEntityOptions = INullableAuthEntityOptions | INonNullableAuthEntityOptions;

export interface INullableAuthEntityOptions {
	scopes?: IEntityScope;
	throwOnAbsence?: false;
}

export interface INonNullableAuthEntityOptions extends Omit<INullableAuthEntityOptions, "throwOnAbsence"> {
	throwOnAbsence: true;
}
