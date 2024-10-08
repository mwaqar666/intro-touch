import { IndustryEntity } from "@/backend/industry/db/entities";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityScope, IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileEntity } from "@/backend/user/db/entities";

export class UserProfileRepository extends BaseRepository<UserProfileEntity> {
	public constructor() {
		super(UserProfileEntity);
	}

	public getUserProfileList(userEntity: UserEntity, scopes: IEntityScope): Promise<Array<UserProfileEntity>> {
		return this.findAll({
			findOptions: {
				where: { userProfileUserId: userEntity.userId },
			},
			scopes,
		});
	}

	public getUserLiveProfile(userEntity: UserEntity, userProfileScopes: IEntityScope, industryScopes: IEntityScope): Promise<UserProfileEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: {
					userProfileIsLive: true,
					userProfileUserId: userEntity.userId,
				},
				include: [
					{
						as: "userProfileIndustry",
						model: IndustryEntity.applyScopes(industryScopes),
						required: false,
					},
				],
			},
			scopes: userProfileScopes,
		});
	}

	public getUserProfile(userProfileUuid: string, userProfileScopes: IEntityScope, industryScopes: IEntityScope): Promise<UserProfileEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: { userProfileUuid },
				include: [
					{
						as: "userProfileIndustry",
						model: IndustryEntity.applyScopes(industryScopes),
						required: false,
					},
				],
			},
			scopes: userProfileScopes,
		});
	}

	public createUserProfile(valuesToCreate: Partial<IEntityTableColumnProperties<UserProfileEntity>>, transaction: Transaction): Promise<UserProfileEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}

	public updateUserProfile(userProfileUuid: string, valuesToUpdate: Partial<IEntityTableColumnProperties<UserProfileEntity>>, transaction: Transaction): Promise<UserProfileEntity> {
		return this.updateOne({
			entity: userProfileUuid,
			valuesToUpdate,
			transaction,
		});
	}

	public async changeLiveProfile(userEntity: UserEntity, userProfileUuid: string, transaction: Transaction): Promise<UserProfileEntity> {
		await this.updateMany({
			where: { userProfileUserId: userEntity.userId },
			valuesToUpdate: { userProfileIsLive: false },
			transaction,
		});

		return this.updateOne({
			entity: userProfileUuid,
			valuesToUpdate: { userProfileIsLive: true },
			transaction,
		});
	}

	public deleteUserProfile(userProfileUuid: string, transaction: Transaction): Promise<boolean> {
		return this.deleteOne({
			entity: userProfileUuid,
			transaction,
		});
	}
}
