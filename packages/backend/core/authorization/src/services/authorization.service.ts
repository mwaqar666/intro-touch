import type { UserEntity } from "@/backend/user/db/entities";
import { ForbiddenException } from "@/backend-core/request-processor/exceptions";
import { Inject } from "iocc";
import type { PermissionEntity } from "@/backend-core/authorization/db/entities";
import { PermissionRepository } from "@/backend-core/authorization/db/repositories";
import type { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";

export class AuthorizationService implements IAuthorization {
	public constructor(
		// Dependencies

		@Inject(PermissionRepository) private readonly permissionRepository: PermissionRepository,
	) {}

	public async can(userEntity: UserEntity, permissions: Array<Permission>): Promise<void> {
		const permissionNames: Array<Permission> = await this.gatherPermissionsOfUser(userEntity);

		const allowed: boolean = permissions.every((permission: Permission) => permissionNames.includes(permission));

		if (allowed) return;

		throw new ForbiddenException();
	}

	private async gatherPermissionsOfUser(userEntity: UserEntity): Promise<Array<Permission>> {
		const userPermissions: Array<PermissionEntity> = await this.permissionRepository.gatherPermissionsOfUser(userEntity);

		return userPermissions.map((permission: PermissionEntity): Permission => permission.permissionName);
	}
}
