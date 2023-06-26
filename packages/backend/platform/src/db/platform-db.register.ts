import type { IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { EntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { CustomPlatformEntity, PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";

export class PlatformDbRegister implements IDbRegister {
	public registerEntities(): Array<EntityType<any>> {
		return [PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity, CustomPlatformEntity];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [];
	}
}
