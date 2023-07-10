import type { Constructable } from "@/stacks/types";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";

export interface IDbRegister {
	registerEntities(): Array<IEntityType<any>>;

	registerMigrations(): Array<Constructable<IMigration>>;

	registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>>;

	registerSeeders(): Array<Constructable<ISeeder, any>>;
}
