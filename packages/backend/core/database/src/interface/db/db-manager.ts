import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister } from "@/backend-core/database/interface/db/db-register";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";

export interface IDbManager {
	registerModuleDb(dbRegister: IDbRegister): void;

	resolveEntities(): Array<IEntityType<any>>;

	resolveMigrations(): Array<IMigration>;

	resolveRepositories(): Array<BaseRepository<BaseEntity<any>>>;

	resolveSeeders(): Array<ISeeder>;
}
