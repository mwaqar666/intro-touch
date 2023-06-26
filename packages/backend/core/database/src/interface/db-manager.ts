import type { IDbRegister } from "@/backend-core/database/interface/db-register";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { EntityType } from "@/backend-core/database/types";

export interface IDbManager {
	registerModuleDb(dbRegister: IDbRegister): void;

	resolveEntities(): Array<EntityType<any>>;

	resolveMigrations(): Array<IMigration>;
}
