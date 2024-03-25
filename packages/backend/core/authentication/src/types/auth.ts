import type { BaseEntity } from "@/backend-core/database/entity";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IAuthenticatable } from "@/backend-core/authentication/interface";

export type IAuthEntity = BaseEntity & IAuthenticatable;
export type IAuthRepository = BaseRepository<IAuthEntity>;
