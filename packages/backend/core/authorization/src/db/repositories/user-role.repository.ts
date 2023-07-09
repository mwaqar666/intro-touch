import { BaseRepository } from "@/backend-core/database/repository";
import { UserRoleEntity } from "@/backend-core/authorization/db/entities";

export class UserRoleRepository extends BaseRepository<UserRoleEntity> {
	public constructor() {
		super(UserRoleEntity);
	}
}
