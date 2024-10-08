import { UserEntity } from "@/backend/user/db/entities";
import { CreatedAtColumn, DateColumn, DefaultUuid, ForeignKeyColumn, IntegerColumn, PrimaryKeyColumn, StringColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { BelongsTo, Scopes, Table } from "sequelize-typescript";
import type { TokenType } from "@/backend-core/authentication/enums";

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
	@StringColumn({ length: 50 })
	public tokenIdentifier: string;

	@DateColumn()
	public tokenExpiry: Date;

	@IntegerColumn()
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
