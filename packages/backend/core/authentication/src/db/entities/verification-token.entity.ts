import { UserEntity } from "@/backend/user/db/entities";
import { DefaultUuid, UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import type { TokenTypeEnum } from "@/backend-core/authentication/db/enums";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => VerificationTokenEntity),
}))
@Table({ tableName: "verificationTokens" })
export class VerificationTokenEntity extends BaseEntity<VerificationTokenEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public tokenId: number;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public tokenUuid: string;

	@ForeignKey(() => UserEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
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
	public tokenType: TokenTypeEnum;

	@BelongsTo(() => UserEntity, {
		as: "tokenUser",
		foreignKey: "tokenUserId",
		targetKey: "userId",
	})
	public tokenUser: UserEntity;
}
