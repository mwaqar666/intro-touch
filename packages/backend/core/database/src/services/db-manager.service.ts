import { AppContainer } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import type { IDbManager, IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { EntityType } from "@/backend-core/database/types";

export class DbManagerService implements IDbManager {
	private readonly _entityRegister: Array<EntityType<any>> = [];
	private readonly _migrationRegister: Array<Constructable<IMigration>> = [];

	public registerModuleDb(dbRegister: IDbRegister): void {
		this._entityRegister.push(...dbRegister.registerEntities());

		this.registerMigrations(dbRegister);
	}

	public resolveMigrations(): Array<IMigration> {
		return this._migrationRegister.map((migrationClass: Constructable<IMigration>): IMigration => {
			return AppContainer.resolve(migrationClass);
		});
	}

	public resolveEntities(): Array<EntityType<any>> {
		return this._entityRegister;
	}

	private registerMigrations(dbRegister: IDbRegister): void {
		const migrationClasses: Array<Constructable<IMigration>> = dbRegister.registerMigrations();
		this._migrationRegister.push(...migrationClasses);

		migrationClasses.forEach((migrationClass: Constructable<IMigration>): void => {
			AppContainer.registerSingleton(migrationClass, { onDuplicate: "ignore" });
		});
	}
}
