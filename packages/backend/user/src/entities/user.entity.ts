import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, UpdatedAtColumn, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, AutoIncrement, Column, DataType, PrimaryKey, Scopes, Table, Unique } from "sequelize-typescript";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserEntity),
}))
@Table({ tableName: "users" })
export class UserEntity extends BaseEntity<UserEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly userId: number;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public readonly userUuid: string;

	@Unique
	@AllowNull(true)
	@Column({ type: DataType.STRING(50) })
	public readonly userCognitoId: Nullable<string>;

	@IsActiveColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public readonly userIsActive: boolean;

	@CreatedAtColumn
	public readonly userCreatedAt: Date;

	@UpdatedAtColumn
	public readonly userUpdatedAt: Date;

	@DeletedAtColumn
	public readonly userDeletedAt: Nullable<Date>;
}
