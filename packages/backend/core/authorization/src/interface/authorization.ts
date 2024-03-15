import type { UserEntity } from "@/backend/user/db/entities";
import type { Permission } from "@/backend-core/authorization/enums";

export interface IAuthorization {
	can(userEntity: UserEntity, permissions: Array<Permission>): Promise<void>;
}
