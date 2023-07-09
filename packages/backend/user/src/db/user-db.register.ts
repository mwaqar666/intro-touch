import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { CreateUserProfilesTable, CreateUsersTable } from "@/backend/user/db/migrations";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";

export class UserDbRegister implements IDbRegister {
	public registerEntities(): Array<IEntityType<any>> {
		return [UserEntity, UserProfileEntity];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateUsersTable, CreateUserProfilesTable];
	}

	public registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [UserRepository, UserProfileRepository];
	}
}
