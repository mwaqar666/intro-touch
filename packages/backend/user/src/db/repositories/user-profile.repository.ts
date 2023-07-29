import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Transaction } from "sequelize";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileEntity } from "@/backend/user/db/entities";
import type { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
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

	public getUserProfile(userProfileUuid: string): Promise<UserProfileEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: { userProfileUuid },
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}

	public updateUserProfile(userProfileUuid: string, updateUserProfileRequestDto: UpdateUserProfileRequestDto, transaction: Transaction): Promise<UserProfileEntity> {
		return this.updateOne({
			findOptions: {
				where: { userProfileUuid },
			},
			valuesToUpdate: updateUserProfileRequestDto,
			transaction,
		});
	}
}
