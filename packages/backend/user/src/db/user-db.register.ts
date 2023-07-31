import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { CreateUserProfilesTable, CreateUsersTable } from "@/backend/user/db/migrations";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import { UsersSeeder } from "@/backend/user/db/seeders";

export class UserDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType<any>> {
		return [UserEntity, UserProfileEntity];
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateUsersTable, CreateUserProfilesTable];
	}

	public override registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [UserRepository, UserProfileRepository];
	}

	public override registerSeeders(): Array<Constructable<ISeeder, any>> {
		return [UsersSeeder];
	}
}
