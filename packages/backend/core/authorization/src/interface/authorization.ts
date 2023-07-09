import type { UserEntity } from "@/backend/user/db/entities";
import type { PermissionsEnum } from "@/backend-core/authorization/enums";

export interface IAuthorization {
	can(userEntity: UserEntity, permissions: Array<PermissionsEnum>): Promise<void>;

	can(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined: false): Promise<boolean>;

	canAny(userEntity: UserEntity, permissions: Array<PermissionsEnum>): Promise<void>;

	canAny(userEntity: UserEntity, permissions: Array<PermissionsEnum>, throwIfDeclined: false): Promise<boolean>;
}
