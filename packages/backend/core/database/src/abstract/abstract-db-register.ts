import type { Constructable } from "@/stacks/types";
import type { IDbRegister } from "@/backend-core/database/interface/db";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";

export abstract class AbstractDbRegister implements IDbRegister {
	public abstract registerEntities(): Array<IEntityType>;

	public abstract registerMigrations(): Array<Constructable<IMigration>>;

	public abstract registerRepositories(): Array<Constructable<BaseRepository>>;

	public abstract registerSeeders(): Array<Constructable<ISeeder>>;
}
