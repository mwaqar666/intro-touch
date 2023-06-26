import { BaseRepository } from "@/backend-core/database/repository";
import { UserProfileEntity } from "@/backend/user/db/entities";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
	}
}
