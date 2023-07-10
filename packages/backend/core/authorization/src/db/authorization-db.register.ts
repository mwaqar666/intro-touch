import { AbstractDbRegister } from "@/backend-core/database/abstract";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IMigration } from "@/backend-core/database/interface/migration";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityType } from "@/backend-core/database/types";
import type { Constructable } from "@/stacks/types";
import { PermissionEntity, RoleEntity, RolePermissionEntity, UserRoleEntity } from "@/backend-core/authorization/db/entities";
import { CreatePermissionsTable, CreateRolePermissionsTable, CreateRolesTable, CreateUserRolesTable } from "@/backend-core/authorization/db/migrations";
import { PermissionRepository, RolePermissionRepository, RoleRepository, UserRoleRepository } from "@/backend-core/authorization/db/repositories";
import { PermissionsSeeder, RolePermissionsSeeder, RolesSeeder, UserRolesSeeder } from "@/backend-core/authorization/db/seeders";

export class AuthorizationDbRegister extends AbstractDbRegister {
	public override registerEntities(): Array<IEntityType<any>> {
		return [RoleEntity, PermissionEntity, RolePermissionEntity, UserRoleEntity];
	}

	public override registerMigrations(): Array<Constructable<IMigration>> {
		return [CreateRolesTable, CreatePermissionsTable, CreateRolePermissionsTable, CreateUserRolesTable];
	}

	public override registerRepositories(): Array<Constructable<BaseRepository<BaseEntity<any>>>> {
		return [RoleRepository, PermissionRepository, RolePermissionRepository, UserRoleRepository];
	}

	public override registerSeeders(): Array<Constructable<ISeeder, any>> {
		return [RolesSeeder, PermissionsSeeder, RolePermissionsSeeder, UserRolesSeeder];
	}
}
