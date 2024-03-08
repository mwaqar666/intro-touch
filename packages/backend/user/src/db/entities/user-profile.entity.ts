import { CustomPlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, BelongsTo, Column, DataType, Default, HasMany, Scopes, Table, Unique } from "sequelize-typescript";
import { UserEntity } from "@/backend/user/db/entities/user.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => UserProfileEntity),
}))
@Table({ tableName: "userProfiles" })
export class UserProfileEntity extends BaseEntity<UserProfileEntity> {
	@PrimaryKeyColumn
	public readonly userProfileId: number;

	@UuidKeyColumn
	public readonly userProfileUuid: string;

	@ForeignKeyColumn(() => UserEntity)
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
	public userProfileLandPhone: Nullable<string>;

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

	@HasMany(() => CustomPlatformEntity, {
		as: "userProfileCustomPlatforms",
		sourceKey: "userProfileId",
		foreignKey: "customPlatformUserProfileId",
	})
	public userProfileCustomPlatforms: Array<CustomPlatformEntity>;
}
