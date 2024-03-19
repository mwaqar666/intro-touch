import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { CustomPlatformEntity, PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreateCustomPlatformsTable, CreatePlatformCategoriesTable, CreatePlatformProfilesTable, CreatePlatformsTable } from "@/backend/platform/db/migrations";
import { CustomPlatformRepository, PlatformCategoryRepository, PlatformProfileRepository, PlatformRepository } from "@/backend/platform/db/repositories";
import { CustomPlatformSeeder, PlatformsSeeder, PlatformUserProfileSeeder } from "@/backend/platform/db/seeders";

export class PlatformDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType> {
		return [PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity, CustomPlatformEntity];
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return [CreatePlatformsTable, CreatePlatformCategoriesTable, CreatePlatformProfilesTable, CreateCustomPlatformsTable];
	}

	public override registerRepositories(): Array<Constructable<BaseRepository>> {
		return [PlatformCategoryRepository, PlatformRepository, PlatformProfileRepository, CustomPlatformRepository];
	}

	public override registerSeeders(): Array<Constructable<ISeeder>> {
		return [PlatformsSeeder, PlatformUserProfileSeeder, CustomPlatformSeeder];
	}
}
