import { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, UpdatedAtColumn, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, PrimaryKey, Scopes, Table, Unique } from "sequelize-typescript";
import { UserEntity } from "@/backend/user/db/entities/user.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserProfileEntity),
}))
@Table({ tableName: "user_profiles" })
export class UserProfileEntity extends BaseEntity<UserProfileEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly userProfileId: number;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public readonly userProfileUuid: string;

	@ForeignKey(() => UserEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public readonly userProfileUserId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userProfileFirstName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userProfileLastName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public userProfilePicture: string;

	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userProfileEmail: string;

	@AllowNull(true)
	@Column({ type: DataType.TEXT })
	public userProfileBio: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(255) })
	public userProfileCompany: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(255) })
	public userProfileJobTitle: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(50) })
	public userProfileWorkplacePhone: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(50) })
	public userProfilePersonalPhone: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(50) })
	public userProfileFax: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(255) })
	public userProfileWebsite: Nullable<string>;

	@Default(false)
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public userProfileIsLive: boolean;

	@IsActiveColumn
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public userProfileIsActive: boolean;

	@CreatedAtColumn
	public userProfileCreatedAt: Date;

	@UpdatedAtColumn
	public userProfileUpdatedAt: Date;

	@DeletedAtColumn
	public userProfileDeletedAt: Nullable<Date>;

	@BelongsTo(() => UserEntity, {
		as: "userProfileUser",
		targetKey: "userId",
		foreignKey: "userProfileUserId",
	})
	public userProfileUser: UserEntity;

	@HasMany(() => PlatformProfileEntity, {
		as: "userProfilePlatformProfiles",
		sourceKey: "userProfileId",
		foreignKey: "platformProfileProfileId",
	})
	public userProfilePlatformProfiles: Array<PlatformProfileEntity>;
}
