import type { Constructable } from "@/stacks/types";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister } from "@/backend-core/database/interface/db";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";

export abstract class AbstractDbRegister implements IDbRegister {
	public registerEntities(): Array<IEntityType<any>> {
		return [];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [];
	}

	public registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>, Array<any>>> {
		return [];
	}

	public registerSeeders(): Array<Constructable<ISeeder, any>> {
		return [];
	}
}
