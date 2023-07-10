import type { UserEntity } from "@/backend/user/db/entities";
import { ForbiddenException } from "@/backend-core/request-processor/exceptions";
import { Inject } from "iocc";
import type { PermissionEntity, RoleEntity } from "@/backend-core/authorization/db/entities";
import { PermissionRepository, RoleRepository } from "@/backend-core/authorization/db/repositories";
import type { PermissionsEnum, RolesEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";

export class AuthorizationService implements IAuthorization {
	public constructor(
		// Dependencies

		@Inject(RoleRepository) private readonly roleRepository: RoleRepository,
		@Inject(PermissionRepository) private readonly permissionRepository: PermissionRepository,
	) {}

	public async is(userEntity: UserEntity, roles: Array<RolesEnum>): Promise<void>;
	public async is(userEntity: UserEntity, roles: Array<RolesEnum>, throwIfDeclined: false): Promise<boolean>;
	public async is(userEntity: UserEntity, roles: Array<RolesEnum>, throwIfDeclined = true): Promise<void | boolean> {
		const roleNames: Array<RolesEnum> = await this.gatherRolesOfUser(userEntity);

		const allowed: boolean = roles.every((role: RolesEnum) => roleNames.includes(role));

		if (throwIfDeclined) {
			if (!allowed) throw new ForbiddenException();

			return;
		}

		return allowed;
	}

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

	public async isAny(userEntity: UserEntity, roles: Array<RolesEnum>): Promise<void>;
	public async isAny(userEntity: UserEntity, roles: Array<RolesEnum>, throwIfDeclined: false): Promise<boolean>;
	public async isAny(userEntity: UserEntity, roles: Array<RolesEnum>, throwIfDeclined = true): Promise<void | boolean> {
		const roleNames: Array<RolesEnum> = await this.gatherRolesOfUser(userEntity);

		const allowed: boolean = roles.some((role: RolesEnum) => roleNames.includes(role));

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

	private async gatherRolesOfUser(userEntity: UserEntity): Promise<Array<RolesEnum>> {
		const userRoles: Array<RoleEntity> = await this.roleRepository.gatherRolesOfUser(userEntity);

		return userRoles.map((role: RoleEntity): RolesEnum => role.roleName);
	}

	private async gatherPermissionsOfUser(userEntity: UserEntity): Promise<Array<PermissionsEnum>> {
		const userPermissions: Array<PermissionEntity> = await this.permissionRepository.gatherPermissionsOfUser(userEntity);

		return userPermissions.map((permission: PermissionEntity): PermissionsEnum => permission.permissionName);
	}
}
