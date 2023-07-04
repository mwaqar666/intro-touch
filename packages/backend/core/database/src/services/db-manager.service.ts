import { AppContainer } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbManager, IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { EntityType } from "@/backend-core/database/types";

export class DbManagerService implements IDbManager {
	private readonly _entityRegister: Array<EntityType<any>> = [];
	private readonly _migrationRegister: Array<Constructable<IMigration>> = [];
	private readonly _repositoryRegister: Array<Constructable<BaseRepository<BaseEntity<any>>>> = [];

	public registerModuleDb(dbRegister: IDbRegister): void {
		this._entityRegister.push(...dbRegister.registerEntities());

		this.registerMigrations(dbRegister);

		this.registerRepositories(dbRegister);
	}

	public resolveEntities(): Array<EntityType<any>> {
		return this._entityRegister;
	}

	public resolveMigrations(): Array<IMigration> {
		return this._migrationRegister.map((migrationClass: Constructable<IMigration>): IMigration => {
			return AppContainer.resolve(migrationClass);
		});
	}

	public resolveRepositories(): Array<BaseRepository<BaseEntity<any>>> {
		return this._repositoryRegister.map((repositoryClass: Constructable<BaseRepository<BaseEntity<any>>>): BaseRepository<BaseEntity<any>> => {
			return AppContainer.resolve(repositoryClass);
		});
	}

	private registerMigrations(dbRegister: IDbRegister): void {
		const migrationClasses: Array<Constructable<IMigration>> = dbRegister.registerMigrations();
		this._migrationRegister.push(...migrationClasses);

		migrationClasses.forEach((migrationClass: Constructable<IMigration>): void => {
			AppContainer.registerSingleton(migrationClass);
		});
	}

	private registerRepositories(dbRegister: IDbRegister): void {
		const repositoryClasses: Array<Constructable<BaseRepository<BaseEntity<any>>>> = dbRegister.registerRepositories();
		this._repositoryRegister.push(...repositoryClasses);

		repositoryClasses.forEach((repositoryClass: Constructable<BaseRepository<BaseEntity<any>>>): void => {
			AppContainer.registerSingleton(repositoryClass);
		});
	}
}
