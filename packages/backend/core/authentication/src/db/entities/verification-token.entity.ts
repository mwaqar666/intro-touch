import { UserEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, DefaultUuid, ForeignKeyColumn, PrimaryKeyColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { AllowNull, BelongsTo, Column, DataType, Scopes, Table } from "sequelize-typescript";
import type { TokenType } from "@/backend-core/authentication/db/enums";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => VerificationTokenEntity),
}))
@Table({ tableName: "verificationTokens" })
export class VerificationTokenEntity extends BaseEntity<VerificationTokenEntity> {
	@PrimaryKeyColumn
	public tokenId: number;

	@UuidKeyColumn
	public tokenUuid: string;

	@ForeignKeyColumn(() => UserEntity)
	public tokenUserId: number;

	@DefaultUuid
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public tokenIdentifier: string;

	@AllowNull(false)
	@Column({ type: DataType.DATE })
	public tokenExpiry: Date;

	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public tokenType: TokenType;

	@CreatedAtColumn
	public tokenCreatedAt: Date;

	@UpdatedAtColumn
	public tokenUpdatedAt: Date;

	@BelongsTo(() => UserEntity, {
		as: "tokenUser",
		foreignKey: "tokenUserId",
		targetKey: "userId",
	})
	public tokenUser: UserEntity;
}
