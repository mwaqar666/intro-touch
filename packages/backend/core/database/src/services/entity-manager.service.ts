import type { Constructable } from "@/stacks/types";
import type { IDbRegister, IEntityManager, IMigration } from "@/backend-core/database/interface";
import type { EntityType } from "@/backend-core/database/types";

export class EntityManagerService implements IEntityManager {
	private readonly _entityRegister: Array<EntityType<any>> = [];
	private readonly _migrationRegisters: Array<Constructable<IMigration>> = [];

	public registerEntities(dbRegister: IDbRegister): void {
		this._entityRegister.push(...dbRegister.registerEntities());
		this._migrationRegisters.push(...dbRegister.registerMigrations());
	}

	public resolveMigrations(): Array<Constructable<IMigration>> {
		return this._migrationRegisters;
	}

	public resolveEntities(): Array<EntityType<any>> {
		return this._entityRegister;
	}
}
