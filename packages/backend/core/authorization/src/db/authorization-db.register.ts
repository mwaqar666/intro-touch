import type { BaseEntity } from "@/backend-core/database/entity";
import type { IDbRegister, IMigration } from "@/backend-core/database/interface";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { EntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { PermissionEntity, RoleEntity, RolePermissionEntity, UserRoleEntity } from "@/backend-core/authorization/db/entities";
import { CreatePermissionsTable, CreateRolePermissionsTable, CreateRolesTable, CreateUserRolesTable } from "@/backend-core/authorization/db/migrations";
import { PermissionRepository, RolePermissionRepository, RoleRepository, UserRoleRepository } from "@/backend-core/authorization/db/repositories";

export class AuthorizationDbRegister implements IDbRegister {
	public registerEntities(): Array<EntityType<any>> {
		return [RoleEntity, PermissionEntity, RolePermissionEntity, UserRoleEntity];
	}

	public registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateRolesTable, CreatePermissionsTable, CreateRolePermissionsTable, CreateUserRolesTable];
	}

	public registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [RoleRepository, PermissionRepository, RolePermissionRepository, UserRoleRepository];
	}
}
