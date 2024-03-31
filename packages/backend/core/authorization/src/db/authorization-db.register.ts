import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import * as Entities from "@/backend-core/authorization/db/entities";
import * as Migrations from "@/backend-core/authorization/db/migrations";
import * as Repositories from "@/backend-core/authorization/db/repositories";
import * as Seeders from "@/backend-core/authorization/db/seeders";

export class AuthorizationDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType> {
		return Object.values(Entities);
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return Object.values(Migrations);
	}

	public override registerRepositories(): Array<Constructable<BaseRepository>> {
		return Object.values(Repositories);
	}

	public override registerSeeders(): Array<Constructable<ISeeder>> {
		return Object.values(Seeders);
	}
}
