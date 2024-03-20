import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { UserContactEntity, UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { CreateUserContactsTableMigration, CreateUserProfilesTable, CreateUsersTable } from "@/backend/user/db/migrations";
import { UserContactRepository, UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import { UsersSeeder } from "@/backend/user/db/seeders";

export class UserDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType<any>> {
		return [UserEntity, UserProfileEntity, UserContactEntity];
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateUsersTable, CreateUserProfilesTable, CreateUserContactsTableMigration];
	}

	public override registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>, Array<any>>> {
		return [UserRepository, UserProfileRepository, UserContactRepository];
	}

	public override registerSeeders(): Array<Constructable<ISeeder>> {
		return [UsersSeeder];
	}
}
