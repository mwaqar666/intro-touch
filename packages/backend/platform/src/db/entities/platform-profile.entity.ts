import { UserProfileEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, UpdatedAtColumn, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import { CustomPlatformEntity } from "@/backend/platform/db/entities/custom-platform.entity";
import { PlatformEntity } from "@/backend/platform/db/entities/platform.entity";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => PlatformProfileEntity),
}))
@Table({ tableName: "platform_user_profiles" })
export class PlatformProfileEntity extends BaseEntity<PlatformProfileEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly platformProfileId: number;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public readonly platformProfileUuid: string;

	@ForeignKey(() => UserProfileEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public platformProfileProfileId: number;

	@ForeignKey(() => PlatformEntity)
	@AllowNull(true)
	@Column({ type: DataType.INTEGER })
	public platformProfilePlatformId: Nullable<number>;

	@ForeignKey(() => CustomPlatformEntity)
	@AllowNull(true)
	@Column({ type: DataType.INTEGER })
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
