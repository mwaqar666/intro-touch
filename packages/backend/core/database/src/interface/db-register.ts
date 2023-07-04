import type { Constructable } from "@/stacks/types";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { EntityType } from "@/backend-core/database/types";

export interface IDbRegister {
	registerEntities(): Array<EntityType<any>>;

	registerMigrations(): Array<Constructable<IMigration>>;

	registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>>;
}
