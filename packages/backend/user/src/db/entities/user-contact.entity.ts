import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, PrimaryKeyColumn, StringColumn, TextColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { BelongsTo, Scopes, Table } from "sequelize-typescript";
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

	@StringColumn({ length: 50 })
	public userContactFirstName: string;

	@StringColumn({ length: 50 })
	public userContactLastName: string;

	@StringColumn({ nullable: true })
	public userContactPicture: Nullable<string>;

	@StringColumn({ length: 50, nullable: true })
	public userContactEmail: Nullable<string>;

	@TextColumn({ nullable: true })
	public userContactNote: Nullable<string>;

	@StringColumn({ length: 50, nullable: true })
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
