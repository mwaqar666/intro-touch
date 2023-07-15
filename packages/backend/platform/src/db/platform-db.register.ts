import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { CustomPlatformEntity, PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreateCustomPlatformsTable, CreatePlatformCategoriesTable, CreatePlatformProfilesTable, CreatePlatformsTable } from "@/backend/platform/db/migrations";
import { CustomPlatformRepository, PlatformCategoryRepository, PlatformProfileRepository, PlatformRepository } from "@/backend/platform/db/repositories";
import { PlatformsSeeder } from "@/backend/platform/db/seeders";

export class PlatformDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType<any>> {
		return [PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity, CustomPlatformEntity];
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return [CreatePlatformsTable, CreatePlatformCategoriesTable, CreatePlatformProfilesTable, CreateCustomPlatformsTable];
	}

	public override registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [PlatformCategoryRepository, PlatformRepository, PlatformProfileRepository, CustomPlatformRepository];
	}

	public override registerSeeders(): Array<Constructable<ISeeder, any>> {
		return [PlatformsSeeder];
	}
}
