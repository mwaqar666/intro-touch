import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister } from "@/backend-core/database/interface/db-register";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { EntityType } from "@/backend-core/database/types";

export interface IDbManager {
	registerModuleDb(dbRegister: IDbRegister): void;

	resolveEntities(): Array<EntityType<any>>;

	resolveMigrations(): Array<IMigration>;

	resolveRepositories(): Array<BaseRepository<BaseEntity<any>>>;
}
