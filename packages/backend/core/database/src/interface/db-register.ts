import type { Constructable } from "@/stacks/types";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { EntityType } from "@/backend-core/database/types";

export interface IDbRegister {
	registerEntities(): Array<EntityType<any>>;

	registerMigrations(): Array<Constructable<IMigration>>;
}
