import { UserProfileEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, ForeignKeyColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, BelongsTo, Column, DataType, Scopes, Table } from "sequelize-typescript";
import { CustomPlatformEntity } from "@/backend/platform/db/entities/custom-platform.entity";
import { PlatformEntity } from "@/backend/platform/db/entities/platform.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformProfileEntity),
}))
@Table({ tableName: "platformProfiles" })
export class PlatformProfileEntity extends BaseEntity<PlatformProfileEntity> {
	@PrimaryKeyColumn
	public readonly platformProfileId: number;

	@UuidKeyColumn
	public readonly platformProfileUuid: string;

	@ForeignKeyColumn(() => UserProfileEntity)
	public platformProfileProfileId: number;

	@ForeignKeyColumn(() => PlatformEntity, true)
	public platformProfilePlatformId: Nullable<number>;

	@ForeignKeyColumn(() => CustomPlatformEntity, true)
	public platformProfileCustomPlatformId: Nullable<number>;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public platformProfileIdentity: string;

	@CreatedAtColumn
	public platformProfileCreatedAt: Date;

	@UpdatedAtColumn
	public platformProfileUpdatedAt: Date;

	@BelongsTo(() => PlatformEntity, {
		as: "platformProfilePlatform",
		targetKey: "platformId",
		foreignKey: "platformProfilePlatformId",
	})
	public platformProfilePlatform: PlatformEntity;

	@BelongsTo(() => CustomPlatformEntity, {
		as: "platformProfileCustomPlatform",
		targetKey: "customPlatformId",
		foreignKey: "platformProfileCustomPlatformId",
	})
	public platformProfileCustomPlatform: CustomPlatformEntity;

	@BelongsTo(() => UserProfileEntity, {
		as: "platformProfileProfile",
		targetKey: "userProfileId",
		foreignKey: "platformProfileProfileId",
	})
	public platformProfileProfile: UserProfileEntity;
}
