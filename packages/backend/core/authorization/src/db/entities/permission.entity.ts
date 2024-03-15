import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, Column, DataType, HasMany, Scopes, Table } from "sequelize-typescript";
import { RolePermissionEntity } from "@/backend-core/authorization/db/entities/role-permission.entity";
import type { Permission } from "@/backend-core/authorization/enums";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PermissionEntity),
}))
@Table({ tableName: "permissions" })
export class PermissionEntity extends BaseEntity<PermissionEntity> {
	@PrimaryKeyColumn
	public permissionId: number;

	@UuidKeyColumn
	public permissionUuid: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public permissionName: Permission;

	@IsActiveColumn
	public permissionIsActive: boolean;

	@CreatedAtColumn
	public permissionCreatedAt: Date;

	@UpdatedAtColumn
	public permissionUpdatedAt: Date;

	@DeletedAtColumn
	public permissionDeletedAt: Nullable<Date>;

	@HasMany(() => RolePermissionEntity, {
		as: "permissionRolePermissions",
		foreignKey: "rolePermissionPermissionId",
		sourceKey: "permissionId",
	})
	public permissionRolePermissions: Array<RolePermissionEntity>;
}
