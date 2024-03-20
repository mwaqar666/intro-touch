import { App } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import type { IDbManager, IDbRegister } from "@/backend-core/database/interface/db";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";

export class DbManagerService implements IDbManager {
	private readonly _entityRegister: Array<IEntityType<any>> = [];
	private readonly _migrationRegister: Array<Constructable<IMigration>> = [];
	private readonly _repositoryRegister: Array<Constructable<BaseRepository>> = [];
	private readonly _seederRegister: Array<Constructable<ISeeder>> = [];

	public registerModuleDb(dbRegister: IDbRegister): void {
		this._entityRegister.push(...dbRegister.registerEntities());

		this.registerMigrations(dbRegister);

		this.registerRepositories(dbRegister);

		this.registerSeeders(dbRegister);
	}

	public resolveEntities(): Array<IEntityType<any>> {
		return this._entityRegister;
	}

	public resolveMigrations(): Array<IMigration> {
		return this._migrationRegister.map((migrationClass: Constructable<IMigration>): IMigration => {
			return App.container.resolve(migrationClass);
		});
	}

	public resolveRepositories(): Array<BaseRepository> {
		return this._repositoryRegister.map((repositoryClass: Constructable<BaseRepository>): BaseRepository => {
			return App.container.resolve(repositoryClass);
		});
	}

	public resolveSeeders(): Array<ISeeder> {
		return this._seederRegister.map((seederClass: Constructable<ISeeder>): ISeeder => {
			return App.container.resolve(seederClass);
		});
	}

	private registerMigrations(dbRegister: IDbRegister): void {
		const migrationClasses: Array<Constructable<IMigration>> = dbRegister.registerMigrations();
		this._migrationRegister.push(...migrationClasses);

		migrationClasses.forEach((migrationClass: Constructable<IMigration>): void => {
			App.container.registerSingleton(migrationClass);
		});
	}

	private registerRepositories(dbRegister: IDbRegister): void {
		const repositoryClasses: Array<Constructable<BaseRepository>> = dbRegister.registerRepositories();
		this._repositoryRegister.push(...repositoryClasses);

		repositoryClasses.forEach((repositoryClass: Constructable<BaseRepository>): void => {
			App.container.registerSingleton(repositoryClass);
		});
	}

	private registerSeeders(dbRegister: IDbRegister): void {
		const seederClasses: Array<Constructable<ISeeder>> = dbRegister.registerSeeders();
		this._seederRegister.push(...seederClasses);

		seederClasses.forEach((seederClass: Constructable<ISeeder>): void => {
			App.container.registerSingleton(seederClass);
		});
	}
}
