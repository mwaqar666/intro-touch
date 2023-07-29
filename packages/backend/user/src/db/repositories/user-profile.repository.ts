import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { UserProfileEntity } from "@/backend/user/db/entities";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
	}

	public async getUserProfiles(userProfileUserId: number, userActiveUserProfileId: number): Promise<Array<UserProfileEntity>> {
		const userProfiles: Promise<Array<UserProfileEntity>> = await this.findAll({
			findOptions: {
				where: { userProfileUserId },
			},
			scopes: [EntityScopeConst.isActive],
		});

		/*return userProfiles.map((userProfile: UserProfileEntity) => ({
            ...userProfile,
            isActive: userProfile.userProfileId === userActiveUserProfileId,
        }));*/
		return userProfiles;
	}
}
