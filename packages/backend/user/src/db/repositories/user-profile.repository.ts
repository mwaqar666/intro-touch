import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { UserProfileEntity } from "@/backend/user/db/entities";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
	}

	public getUserProfiles(userProfileUserId: number): Promise<Array<UserProfileEntity>> {
		return await this.findAll({
			findOptions: {
				where: { userProfileUserId },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}
}
