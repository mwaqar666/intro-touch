import { randomUUID } from "crypto";
import { HashService } from "@/backend-core/authentication/crypt";
import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { PasswordMissingException } from "@/backend-core/authentication/exceptions";
import type { IAuthenticatable } from "@/backend-core/authentication/interface";
import { UserRoleEntity } from "@/backend-core/authorization/db/entities";
import { App } from "@/backend-core/core/extensions";
import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Key, Nullable } from "@/stacks/types";
import { AllowNull, BeforeBulkCreate, BeforeBulkUpdate, BeforeCreate, BeforeUpdate, BeforeValidate, BelongsTo, Column, DataType, HasMany, HasOne, Scopes, Table, Unique } from "sequelize-typescript";
import { UserContactEntity } from "@/backend/user/db/entities/user-contact.entity";
import { UserProfileEntity } from "@/backend/user/db/entities/user-profile.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserEntity),
}))
@Table({ tableName: "users" })
export class UserEntity extends BaseEntity<UserEntity> implements IAuthenticatable<UserEntity> {
	public static override readonly hiddenKeys: Array<string> = ["userPassword"];

	@PrimaryKeyColumn
	public readonly userId: number;

	@UuidKeyColumn
	public readonly userUuid: string;

	@ForeignKeyColumn(() => UserEntity, true)
	public userParentId: Nullable<number>;

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

	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public userUsername: string;

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

	@HasMany(() => UserEntity, {
		as: "userChildrenUsers",
		foreignKey: "userParentId",
		sourceKey: "userId",
	})
	public userChildrenUsers: Array<UserEntity>;

	@BelongsTo(() => UserEntity, {
		as: "userParentUser",
		foreignKey: "userParentId",
		targetKey: "userId",
	})
	public userParentUser: Nullable<UserEntity>;

	@HasMany(() => UserContactEntity, {
		as: "userUserContacts",
		sourceKey: "userId",
		foreignKey: "userContactUserId",
	})
	public userUserContacts: Array<UserContactEntity>;

	@BeforeValidate
	@BeforeUpdate
	@BeforeCreate
	@BeforeBulkCreate
	@BeforeBulkUpdate
	public static async hashPasswordHook(instances: UserEntity | Array<UserEntity>): Promise<void> {
		await BaseEntity.runHookForOneOrMoreInstances(instances, async (instance: UserEntity): Promise<void> => {
			if (!instance.userPassword || !instance.changed("userPassword")) return;

			const hashService: HashService = App.container.resolve(HashService);
			instance.userPassword = await hashService.hash(instance.userPassword);
		});
	}

	@BeforeValidate
	@BeforeCreate
	@BeforeBulkCreate
	public static async createUsernameHook(instances: UserEntity | Array<UserEntity>): Promise<void> {
		await BaseEntity.runHookForOneOrMoreInstances(instances, async (instance: UserEntity): Promise<void> => {
			const firstName: string = instance.userFirstName.trim().toLowerCase();
			const lastName: string = instance.userLastName.trim().toLowerCase();

			instance.userUsername = `${firstName}-${lastName}-${randomUUID()}`;
		});
	}

	public async verifyPassword(plainPassword: string): Promise<boolean> {
		if (!this.userPassword) throw new PasswordMissingException();

		const hashService: HashService = App.container.resolve(HashService);
		return await hashService.compare(plainPassword, this.userPassword);
	}

	public getAuthIdentifierName(): Key<IEntityTableColumnProperties<UserEntity>> {
		return "userId";
	}

	public getAuthIdentifier(): number {
		return this.userId;
	}

	public getAuthPasswordName(): Key<IEntityTableColumnProperties<UserEntity>> {
		return "userPassword";
	}

	public getAuthPassword(): Nullable<string> {
		return this.userPassword;
	}
}
