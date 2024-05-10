import type { UserEntity } from "@/backend/user/db/entities";
import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Includeable } from "sequelize";
import { RoleEntity, UserRoleEntity } from "@/backend-core/authorization/db/entities";
import type { Role } from "@/backend-core/authorization/enums";

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

	public getRoleByRoleName(roleName: Role): Promise<RoleEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: { roleName },
			},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}
}
