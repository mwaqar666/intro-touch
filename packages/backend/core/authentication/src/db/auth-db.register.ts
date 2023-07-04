import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { EntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { CreateVerificationTokensTable } from "@/backend-core/authentication/db/migrations";

export class AuthDbRegister implements IDbRegister {
	public registerEntities(): Array<EntityType<any>> {
		return [];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateVerificationTokensTable];
	}

	public registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [];
	}
}
