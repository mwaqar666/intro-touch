import type { UserEntity } from "@/backend/user/db/entities";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Transaction } from "sequelize";
import type { RoleEntity } from "@/backend-core/authorization/db/entities";
import { UserRoleEntity } from "@/backend-core/authorization/db/entities";

export class UserRoleRepository extends BaseRepository<UserRoleEntity> {
	public constructor() {
		super(UserRoleEntity);
	}

	public attachRoleToUser(user: UserEntity, role: RoleEntity, transaction: Transaction): Promise<UserRoleEntity> {
		return this.createOne({
			valuesToCreate: {
				userRoleUserId: user.userId,
				userRoleRoleId: role.roleId,
			},
			transaction,
		});
	}
}
