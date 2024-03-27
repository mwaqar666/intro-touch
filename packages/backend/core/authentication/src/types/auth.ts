import type { BaseEntity } from "@/backend-core/database/entity";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IAuthenticatable } from "@/backend-core/authentication/interface";

export type IAuthenticatableEntity = BaseEntity & IAuthenticatable;
export type IAuthenticatableRepository = BaseRepository<IAuthenticatableEntity>;
