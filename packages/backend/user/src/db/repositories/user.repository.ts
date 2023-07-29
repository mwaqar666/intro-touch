import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";

export class UserRepository extends BaseRepository<UserEntity> {
	public constructor() {
		super(UserEntity);
	}

	public getUserWithLiveProfileIdentifier(userUuid: string): Promise<UserEntity> {
		return this.findOneOrFail({
			findOptions: {
				include: [
					{
						model: UserProfileEntity.scope([EntityScopeConst.primaryKeyAndUuidOnly]),
					},
				],
				where: { userUuid },
			},
			scopes: [EntityScopeConst.withoutTimestamps],
		});
	}
}
