import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { EntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { CustomPlatformEntity, PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreateCustomPlatformsTable, CreatePlatformCategoriesTable, CreatePlatformProfilesTable, CreatePlatformsTable } from "@/backend/platform/db/migrations";
import { CustomPlatformRepository, PlatformCategoryRepository, PlatformProfileRepository, PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformDbRegister implements IDbRegister {
	public registerEntities(): Array<EntityType<any>> {
		return [PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity, CustomPlatformEntity];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [CreatePlatformsTable, CreatePlatformCategoriesTable, CreatePlatformProfilesTable, CreateCustomPlatformsTable];
	}

	public registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [PlatformCategoryRepository, PlatformRepository, PlatformProfileRepository, CustomPlatformRepository];
	}
}
