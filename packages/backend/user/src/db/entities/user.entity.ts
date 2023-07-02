import { HashService } from "@/backend-core/authentication/services";
import { AppContainer } from "@/backend-core/core/extensions";
import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, UpdatedAtColumn, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, AutoIncrement, BeforeCreate, BeforeUpdate, Column, DataType, HasMany, PrimaryKey, Scopes, Table, Unique } from "sequelize-typescript";
import { UserProfileEntity } from "@/backend/user/db/entities/user-profile.entity";
import { PasswordMissingException } from "@/backend/user/exceptions";

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

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userFirstName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userLastName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public userPicture: string;

	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userEmail: string;

	@AllowNull(true)
	@Column({ type: DataType.STRING(50) })
	public userPassword: Nullable<string>;

	@IsActiveColumn
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public userIsActive: boolean;

	@CreatedAtColumn
	public userCreatedAt: Date;

	@UpdatedAtColumn
	public userUpdatedAt: Date;

	@DeletedAtColumn
	public userDeletedAt: Nullable<Date>;

	@HasMany(() => UserProfileEntity, {
		as: "userUserProfiles",
		sourceKey: "userId",
		foreignKey: "userProfileUserId",
	})
	public userUserProfiles: Array<UserProfileEntity>;

	@BeforeUpdate
	@BeforeCreate
	public static async hashPassword(instance: UserEntity): Promise<UserEntity> {
		if (!instance.changed("userPassword") || !instance.userPassword) return instance;

		const hashService: HashService = AppContainer.resolve(HashService);
		instance.userPassword = await hashService.hash(instance.userPassword);

		return instance;
	}

	public async comparePassword(plainPassword: string): Promise<boolean> {
		if (!this.userPassword) throw new PasswordMissingException();

		const hashService: HashService = AppContainer.resolve(HashService);
		return await hashService.compare(plainPassword, this.userPassword);
	}
}
