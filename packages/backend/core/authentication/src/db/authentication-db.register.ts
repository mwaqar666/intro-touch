import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { CreateVerificationTokensTable } from "@/backend-core/authentication/db/migrations";
import { VerificationTokenRepository } from "@/backend-core/authentication/db/repositories";

export class AuthenticationDbRegister implements IDbRegister {
	public registerEntities(): Array<IEntityType<any>> {
		return [VerificationTokenEntity];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateVerificationTokensTable];
	}

	public registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [VerificationTokenRepository];
	}
}
