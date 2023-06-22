import type { Constructable } from "@/stacks/types";
import type { IDbRegister } from "@/backend-core/database/interface/db-register";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { EntityType } from "@/backend-core/database/types";

export interface IEntityManager {
	registerEntities(dbRegister: IDbRegister): void;

	resolveEntities(): Array<EntityType<any>>;

	resolveMigrations(): Array<Constructable<IMigration>>;
}
