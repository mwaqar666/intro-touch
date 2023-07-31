import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { PasswordMissingException } from "@/backend-core/authentication/exceptions";
import { HashService } from "@/backend-core/authentication/services/crypt";
import { UserRoleEntity } from "@/backend-core/authorization/db/entities";
import { AppContainer } from "@/backend-core/core/extensions";
import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import omit from "lodash.omit";
import { AllowNull, BeforeCreate, BeforeUpdate, Column, DataType, HasMany, HasOne, Scopes, Table, Unique } from "sequelize-typescript";
import { UserProfileEntity } from "@/backend/user/db/entities/user-profile.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserEntity),
}))
@Table({ tableName: "users" })
export class UserEntity extends BaseEntity<UserEntity> {
	@PrimaryKeyColumn
	public readonly userId: number;

	@UuidKeyColumn
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

	@HasOne(() => UserProfileEntity, {
		as: "userLiveUserProfile",
		sourceKey: "userId",
		foreignKey: "userProfileUserId",
	})
	public userLiveUserProfile: UserProfileEntity;

	@HasMany(() => VerificationTokenEntity, {
		as: "userTokens",
		foreignKey: "tokenUserId",
		sourceKey: "userId",
	})
	public userTokens: Array<VerificationTokenEntity>;

	@HasMany(() => UserRoleEntity, {
		as: "userUserRoles",
		foreignKey: "userRoleUserId",
		sourceKey: "userId",
	})
	public userUserRoles: Array<UserRoleEntity>;

	@BeforeUpdate
	@BeforeCreate
	public static async hashPassword(instance: UserEntity): Promise<UserEntity> {
		if (!instance.changed("userPassword") || !instance.userPassword) return instance;

		const hashService: HashService = AppContainer.resolve(HashService);
		instance.userPassword = await hashService.hash(instance.userPassword);

		return instance;
	}

	public override toJSON(): object {
		const plainModel: object = super.toJSON();

		return omit(plainModel, ["userPassword"]);
	}

	public async verifyPassword(plainPassword: string): Promise<boolean> {
		if (!this.userPassword) throw new PasswordMissingException();

		const hashService: HashService = AppContainer.resolve(HashService);
		return await hashService.compare(plainPassword, this.userPassword);
	}
}
