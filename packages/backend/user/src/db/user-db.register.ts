import type { IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { EntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { CreateUserProfilesTable, CreateUsersTable } from "@/backend/user/db/migrations";

export class UserDbRegister implements IDbRegister {
	public registerEntities(): Array<EntityType<any>> {
		return [UserEntity, UserProfileEntity];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateUsersTable, CreateUserProfilesTable];
	}
}
