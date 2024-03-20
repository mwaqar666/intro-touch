import { UserProfileEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, DeletedAtColumn, ForeignKeyColumn, IsActiveColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { AllowNull, BelongsTo, Column, DataType, Scopes, Table } from "sequelize-typescript";
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

	@ForeignKeyColumn(() => PlatformEntity)
	public platformProfilePlatformId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING(255) })
	public platformProfileIdentity: string;

	@IsActiveColumn
	public platformProfileIsActive: boolean;

	@CreatedAtColumn
	public platformProfileCreatedAt: Date;

	@UpdatedAtColumn
	public platformProfileUpdatedAt: Date;

	@DeletedAtColumn
	public platformProfileDeletedAt: Nullable<Date>;

	@BelongsTo(() => PlatformEntity, {
		as: "platformProfilePlatform",
		targetKey: "platformId",
		foreignKey: "platformProfilePlatformId",
	})
	public platformProfilePlatform: PlatformEntity;

	@BelongsTo(() => UserProfileEntity, {
		as: "platformProfileProfile",
		targetKey: "userProfileId",
		foreignKey: "platformProfileProfileId",
	})
	public platformProfileProfile: UserProfileEntity;
}
