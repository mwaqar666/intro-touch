import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { ITransactionStore } from "@/backend-core/database/types";
import { UserProfileEntity } from "@/backend/user/db/entities";
import type { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
	}

	public getUserProfiles(userProfileUserId: number): Promise<Array<UserProfileEntity>> {
		return this.findAll({
			findOptions: {
				where: { userProfileUserId },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public getUserProfile(userProfileUuid: string): Promise<UserProfileEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: { userProfileUuid },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public updateUserProfile(userProfileUuid: string, updateUserProfileRequestDto: UpdateUserProfileRequestDto, { transaction }: ITransactionStore): Promise<UserProfileEntity> {
		return this.updateOne({
			findOptions: {
				where: { userProfileUuid },
			},
			valuesToUpdate: updateUserProfileRequestDto,
			transaction,
		});
	}
}
