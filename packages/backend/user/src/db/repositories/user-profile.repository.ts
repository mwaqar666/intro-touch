import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileEntity } from "@/backend/user/db/entities";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
	}

	public getAuthUserLiveProfile(authEntity: UserEntity): Promise<UserProfileEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: {
					userProfileIsLive: true,
					userProfileUserId: authEntity.userId,
				},
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}

	public getAuthUserProfileDropdown(authEntity: UserEntity): Promise<Array<UserProfileEntity>> {
		return this.findAll({
			findOptions: {
				attributes: ["userProfileFirstName", "userProfileLastName", "userProfilePicture", "userProfileEmail"],
				where: { userProfileUserId: authEntity.userId },
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.primaryKeyAndUuidOnly],
		});
	}
}
