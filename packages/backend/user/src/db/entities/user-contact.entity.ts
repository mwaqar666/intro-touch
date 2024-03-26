import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, BelongsTo, Column, DataType, Scopes, Table } from "sequelize-typescript";
import { UserEntity } from "@/backend/user/db/entities/user.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserContactEntity),
}))
@Table({ tableName: "userContacts" })
export class UserContactEntity extends BaseEntity<UserContactEntity> {
	@PrimaryKeyColumn
	public readonly userContactId: number;

	@UuidKeyColumn
	public readonly userContactUuid: string;

	@ForeignKeyColumn(() => UserEntity)
	public readonly userContactUserId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userContactFirstName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userContactLastName: string;

	@AllowNull(true)
	@Column({ type: DataType.STRING(255) })
	public userContactPicture: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(50) })
	public userContactEmail: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.TEXT })
	public userContactNote: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(50) })
	public userContactPhone: Nullable<string>;

	@CreatedAtColumn
	public userContactCreatedAt: Date;

	@UpdatedAtColumn
	public userContactUpdatedAt: Date;

	@DeletedAtColumn
	public userContactDeletedAt: Nullable<Date>;

	@BelongsTo(() => UserEntity, {
		as: "userContactUser",
		targetKey: "userId",
		foreignKey: "userContactUserId",
	})
	public userContactUser: UserEntity;
}
