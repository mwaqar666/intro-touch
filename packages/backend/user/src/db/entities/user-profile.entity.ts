import { CustomPlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { BooleanColumn, CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, StringColumn, TextColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { BelongsTo, Default, HasMany, Scopes, Table, Unique } from "sequelize-typescript";
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

	@StringColumn({ length: 50 })
	public userProfileFirstName: string;

	@StringColumn({ length: 50 })
	public userProfileLastName: string;

	@StringColumn()
	public userProfilePicture: string;

	@Unique
	@StringColumn({ length: 50 })
	public userProfileEmail: string;

	@TextColumn({ nullable: true })
	public userProfileBio: Nullable<string>;

	@StringColumn({ nullable: true })
	public userProfileCompany: Nullable<string>;

	@StringColumn({ nullable: true })
	public userProfileJobTitle: Nullable<string>;

	@StringColumn({ length: 50, nullable: true })
	public userProfileWorkplacePhone: Nullable<string>;

	@StringColumn({ length: 50, nullable: true })
	public userProfilePersonalPhone: Nullable<string>;

	@StringColumn({ length: 50, nullable: true })
	public userProfileLandPhone: Nullable<string>;

	@StringColumn({ length: 50, nullable: true })
	public userProfileFax: Nullable<string>;

	@StringColumn({ nullable: true })
	public userProfileWebsite: Nullable<string>;

	@Default(false)
	@BooleanColumn()
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
