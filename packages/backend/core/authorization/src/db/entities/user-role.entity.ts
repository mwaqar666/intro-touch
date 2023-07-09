import { UserEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, ForeignKeyColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { BelongsTo, Scopes, Table } from "sequelize-typescript";
import { RoleEntity } from "@/backend-core/authorization/db/entities/role.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserRoleEntity),
}))
@Table({ tableName: "userRoles" })
export class UserRoleEntity extends BaseEntity<UserRoleEntity> {
	@PrimaryKeyColumn
	public userRoleId: number;

	@UuidKeyColumn
	public userRoleUuid: string;

	@ForeignKeyColumn(() => RoleEntity)
	public userRoleRoleId: number;

	@ForeignKeyColumn(() => UserEntity)
	public userRoleUserId: number;

	@CreatedAtColumn
	public userRoleCreatedAt: Date;

	@UpdatedAtColumn
	public userRoleUpdatedAt: Date;

	@BelongsTo(() => RoleEntity, {
		as: "userRoleRole",
		foreignKey: "userRoleRoleId",
		targetKey: "roleId",
	})
	public userRoleRole: RoleEntity;

	@BelongsTo(() => UserEntity, {
		as: "userRoleUser",
		foreignKey: "userRoleUserId",
		targetKey: "userId",
	})
	public userRoleUser: UserEntity;
}
