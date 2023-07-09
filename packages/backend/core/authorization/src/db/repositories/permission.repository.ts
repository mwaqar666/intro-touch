import type { UserEntity } from "@/backend/user/db/entities";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Includeable } from "sequelize";
import { PermissionEntity, RoleEntity, RolePermissionEntity, UserRoleEntity } from "@/backend-core/authorization/db/entities";

export class PermissionRepository extends BaseRepository<PermissionEntity> {
	public constructor() {
		super(PermissionEntity);
	}

	public gatherPermissionsOfUser(userEntity: UserEntity): Promise<Array<PermissionEntity>> {
		const userRoleInclusion: Includeable = {
			model: UserRoleEntity,
			as: "roleUserRoles",
			attributes: ["userRoleId", "userRoleUserId", "userRoleRoleId"],
			where: { userRoleUserId: userEntity.userId },
		};

		const roleInclusion: Includeable = {
			model: RoleEntity,
			as: "rolePermissionRole",
			attributes: ["roleId"],
			include: [userRoleInclusion],
		};

		const rolePermissionInclusion: Includeable = {
			model: RolePermissionEntity,
			as: "permissionRolePermissions",
			attributes: ["rolePermissionId", "rolePermissionRoleId", "rolePermissionPermissionId"],
			include: [roleInclusion],
		};

		return this.findAll({
			findOptions: {
				attributes: ["permissionId", "permissionName"],
				include: [rolePermissionInclusion],
			},
		});
	}
}
