import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { InvalidCredentialsException, PasswordMissingException } from "@/backend-core/authentication/exceptions";
import type { IAuthenticatable } from "@/backend-core/authentication/interface";
import { HashService } from "@/backend-core/authentication/services/crypt";
import { UserRoleEntity } from "@/backend-core/authorization/db/entities";
import { App } from "@/backend-core/core/extensions";
import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, StringColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Delegate, Nullable } from "@/stacks/types";
import { BeforeBulkCreate, BeforeBulkUpdate, BeforeCreate, BeforeUpdate, BeforeValidate, BelongsTo, HasMany, HasOne, Scopes, Table, Unique } from "sequelize-typescript";
import { UserContactEntity } from "@/backend/user/db/entities/user-contact.entity";
import { UserProfileEntity } from "@/backend/user/db/entities/user-profile.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserEntity),
}))
@Table({ tableName: "users" })
export class UserEntity extends BaseEntity<UserEntity> implements IAuthenticatable {
	public static override readonly hiddenKeys: Array<string> = ["userPassword"];

	@PrimaryKeyColumn
	public readonly userId: number;

	@UuidKeyColumn
	public readonly userUuid: string;

	@ForeignKeyColumn(() => UserEntity, true)
	public userParentId: Nullable<number>;

	@StringColumn({ length: 50 })
	public userFirstName: string;

	@StringColumn({ length: 50 })
	public userLastName: string;

	@StringColumn()
	public userPicture: string;

	@Unique
	@StringColumn({ length: 50 })
	public userEmail: string;

	@Unique
	@StringColumn({ length: 100 })
	public userUsername: string;

	@StringColumn({ length: 50, nullable: true })
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

	@BeforeCreate
	@BeforeUpdate
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
	@BeforeBulkCreate
	public static async createUserDefaultUserPictureHook(instances: UserEntity | Array<UserEntity>): Promise<void> {
		await BaseEntity.runHookForOneOrMoreInstances(instances, async (instance: UserEntity): Promise<void> => {
			if (instance.userPicture) return;

			instance.userPicture = `https://api.dicebear.com/8.x/initials/svg?seed=${instance.userFirstName} ${instance.userLastName}`;
		});
	}

	@BeforeValidate
	@BeforeBulkCreate
	public static async createUsernameHook(instances: UserEntity | Array<UserEntity>): Promise<void> {
		await BaseEntity.runHookForOneOrMoreInstances(instances, async (instance: UserEntity): Promise<void> => {
			if (instance.userUsername) return;

			const prepareName: Delegate<[string], string> = (name: string): string => {
				name = name.trim().toLowerCase();

				while (name.includes(" ")) name = name.replace(" ", "_");

				return name;
			};

			const userNameFirstPart: string = prepareName(instance.userFirstName);
			const userNameLastPart: string = prepareName(instance.userLastName);
			const userNameIdentifier: string = Math.floor(1000 + 9000 * Math.random()).toString();

			instance.userUsername = `${userNameFirstPart}_${userNameLastPart}_${userNameIdentifier}`;
		});
	}

	public getAuthPrimaryKey(): number {
		return this.userId;
	}

	public getAuthUuidIdentifier(): string {
		return this.userUuid;
	}

	public getAuthEmailIdentifier(): string {
		return this.userEmail;
	}

	public getAuthPassword(): Nullable<string> {
		return this.userPassword;
	}

	public async verifyPassword(plainPassword: string): Promise<void> {
		const authPassword: Nullable<string> = this.getAuthPassword();

		if (!authPassword) throw new PasswordMissingException();

		const hashService: HashService = App.container.resolve(HashService);

		const passwordVerified: boolean = await hashService.compare(plainPassword, authPassword);

		if (passwordVerified) return;

		throw new InvalidCredentialsException();
	}
}
