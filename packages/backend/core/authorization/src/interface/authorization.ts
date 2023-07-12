import type { UserEntity } from "@/backend/user/db/entities";
import type { PermissionsEnum, RolesEnum } from "@/backend-core/authorization/enums";

export interface IAuthorization {
	is(userEntity: UserEntity, roles: Array<RolesEnum>): Promise<void>;

	is(userEntity: UserEntity, roles: Array<RolesEnum>, throwIfDeclined: false): Promise<boolean>;

	can(userEntity: UserEntity, permissions: Array<PermissionsEnum>): Promise<void>;

	can(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined: false): Promise<boolean>;

	isAny(userEntity: UserEntity, permissions: Array<RolesEnum>): Promise<void>;

	isAny(userEntity: UserEntity, permissions: Array<RolesEnum>, throwIfDeclined: false): Promise<boolean>;

	canAny(userEntity: UserEntity, permissions: Array<PermissionsEnum>): Promise<void>;

	canAny(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined: false): Promise<boolean>;
}
