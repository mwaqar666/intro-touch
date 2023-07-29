import { BaseRepository } from "@/backend-core/database/repository";
import { UserEntity } from "@/backend/user/db/entities";

export class UserRepository extends BaseRepository<UserEntity> {
	public constructor() {
		super(UserEntity);
	}
}
