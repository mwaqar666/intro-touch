import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileEntity } from "@/backend/user/db/entities";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
	}

	public getUserProfileDropdown(userEntity: UserEntity): Promise<Array<UserProfileEntity>> {
		return this.findAll({
			findOptions: {
				attributes: ["userProfileFirstName", "userProfileLastName", "userProfilePicture", "userProfileEmail"],
				where: { userProfileUserId: userEntity.userId },
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.primaryKeyAndUuidOnly],
		});
	}

	public getUserLiveProfile(userEntity: UserEntity): Promise<UserProfileEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: {
					userProfileIsLive: true,
					userProfileUserId: userEntity.userId,
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

	public updateUserProfile(userProfileUuid: string, valuesToUpdate: Partial<IEntityTableColumnProperties<UserProfileEntity>>, transaction: Transaction): Promise<UserProfileEntity> {
		return this.updateOne({
			findOptions: {
				where: { userProfileUuid },
			},
			valuesToUpdate,
			transaction,
		});
	}
}
