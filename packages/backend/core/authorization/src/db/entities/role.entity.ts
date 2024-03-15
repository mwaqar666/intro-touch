import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, Column, DataType, HasMany, Scopes, Table } from "sequelize-typescript";
import { RolePermissionEntity } from "@/backend-core/authorization/db/entities/role-permission.entity";
import { UserRoleEntity } from "@/backend-core/authorization/db/entities/user-role.entity";
import type { Role } from "@/backend-core/authorization/enums";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => RoleEntity),
}))
@Table({ tableName: "roles" })
export class RoleEntity extends BaseEntity<RoleEntity> {
	@PrimaryKeyColumn
	public roleId: number;

	@UuidKeyColumn
	public roleUuid: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public roleName: Role;

	@IsActiveColumn
	public roleIsActive: boolean;

	@CreatedAtColumn
	public roleCreatedAt: Date;

	@UpdatedAtColumn
	public roleUpdatedAt: Date;

	@DeletedAtColumn
	public roleDeletedAt: Nullable<Date>;

	@HasMany(() => RolePermissionEntity, {
		as: "roleRolePermissions",
		foreignKey: "rolePermissionRoleId",
		sourceKey: "roleId",
	})
	public roleRolePermissions: Array<RolePermissionEntity>;

	@HasMany(() => UserRoleEntity, {
		as: "roleUserRoles",
		foreignKey: "userRoleRoleId",
		sourceKey: "roleId",
	})
	public roleUserRoles: Array<UserRoleEntity>;
}
