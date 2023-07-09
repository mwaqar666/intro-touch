import { CreatedAtColumn, ForeignKeyColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { BelongsTo, Scopes, Table } from "sequelize-typescript";
import { PermissionEntity } from "@/backend-core/authorization/db/entities/permission.entity";
import { RoleEntity } from "@/backend-core/authorization/db/entities/role.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => RolePermissionEntity),
}))
@Table({ tableName: "rolePermissions" })
export class RolePermissionEntity extends BaseEntity<RolePermissionEntity> {
	@PrimaryKeyColumn
	public rolePermissionId: number;

	@UuidKeyColumn
	public rolePermissionUuid: string;

	@ForeignKeyColumn(() => RoleEntity)
	public rolePermissionRoleId: number;

	@ForeignKeyColumn(() => PermissionEntity)
	public rolePermissionPermissionId: number;

	@CreatedAtColumn
	public rolePermissionCreatedAt: Date;

	@UpdatedAtColumn
	public rolePermissionUpdatedAt: Date;

	@BelongsTo(() => RoleEntity, {
		as: "rolePermissionRole",
		foreignKey: "rolePermissionRoleId",
		targetKey: "roleId",
	})
	public rolePermissionRole: RoleEntity;

	@BelongsTo(() => PermissionEntity, {
		as: "rolePermissionPermission",
		foreignKey: "rolePermissionPermissionId",
		targetKey: "permissionId",
	})
	public rolePermissionPermission: PermissionEntity;
}
