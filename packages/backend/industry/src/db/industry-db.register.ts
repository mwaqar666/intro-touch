import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { IndustryEntity } from "@/backend/industry/db/entities";
import { CreateIndustriesTable } from "@/backend/industry/db/migrations";
import { IndustryRepository } from "@/backend/industry/db/repositories";
import { IndustriesSeeder } from "@/backend/industry/db/seeders";

export class IndustryDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType> {
		return [IndustryEntity];
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateIndustriesTable];
	}

	public override registerRepositories(): Array<Constructable<BaseRepository>> {
		return [IndustryRepository];
	}

	public override registerSeeders(): Array<Constructable<ISeeder>> {
		return [IndustriesSeeder];
	}
}
