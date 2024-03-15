import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { CreateVerificationTokensTable } from "@/backend-core/authentication/db/migrations";
import { VerificationTokenRepository } from "@/backend-core/authentication/db/repositories";

export class AuthenticationDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType<any>> {
		return [VerificationTokenEntity];
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateVerificationTokensTable];
	}

	public override registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>, Array<any>>> {
		return [VerificationTokenRepository];
	}
}
