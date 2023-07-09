import type { UserEntity } from "@/backend/user/db/entities";
import { ForbiddenException } from "@/backend-core/request-processor/exceptions";
import { Inject } from "iocc";
import type { PermissionEntity } from "@/backend-core/authorization/db/entities";
import { PermissionRepository } from "@/backend-core/authorization/db/repositories";
import type { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";

export class AuthorizationService implements IAuthorization {
	public constructor(
		// Dependencies

		@Inject(PermissionRepository) private readonly permissionRepository: PermissionRepository,
	) {}

	public async can(userEntity: UserEntity, permissions: Array<PermissionsEnum>): Promise<void>;
	public async can(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined: false): Promise<boolean>;
	public async can(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined = true): Promise<void | boolean> {
		const permissionNames: Array<PermissionsEnum> = await this.gatherPermissionsOfUser(userEntity);

		const allowed: boolean = permissions.every((permission: PermissionsEnum) => permissionNames.includes(permission));

		if (throwIfDeclined) {
			if (!allowed) throw new ForbiddenException();

			return;
		}

		return allowed;
	}

	public async canAny(userEntity: UserEntity, permissions: Array<PermissionsEnum>): Promise<void>;
	public async canAny(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined: false): Promise<boolean>;
	public async canAny(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined = true): Promise<void | boolean> {
		const permissionNames: Array<PermissionsEnum> = await this.gatherPermissionsOfUser(userEntity);

		const allowed: boolean = permissions.some((permission: PermissionsEnum) => permissionNames.includes(permission));

		if (throwIfDeclined) {
			if (!allowed) throw new ForbiddenException();

			return;
		}

		return allowed;
	}

	private async gatherPermissionsOfUser(userEntity: UserEntity): Promise<Array<PermissionsEnum>> {
		const userPermissions: Array<PermissionEntity> = await this.permissionRepository.gatherPermissionsOfUser(userEntity);

		return userPermissions.map((permission: PermissionEntity): PermissionsEnum => permission.permissionName);
	}
}
