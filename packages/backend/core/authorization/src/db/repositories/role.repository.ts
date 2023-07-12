import type { UserEntity } from "@/backend/user/db/entities";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Includeable } from "sequelize";
import { RoleEntity, UserRoleEntity } from "@/backend-core/authorization/db/entities";

export class RoleRepository extends BaseRepository<RoleEntity> {
	public constructor() {
		super(RoleEntity);
	}

	public gatherRolesOfUser(userEntity: UserEntity): Promise<Array<RoleEntity>> {
		const userRoleInclusion: Includeable = {
			model: UserRoleEntity,
			as: "roleUserRoles",
			attributes: ["userRoleId", "userRoleUserId", "userRoleRoleId"],
			where: { userRoleUserId: userEntity.userId },
		};

		return this.findAll({
			findOptions: {
				attributes: ["roleId", "roleName"],
				include: [userRoleInclusion],
			},
		});
	}
}
