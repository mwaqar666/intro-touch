import { UserEntity } from "@/backend/user/db/entities";
import { UuidColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Scopes, Table } from "sequelize-typescript";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => VerificationTokenEntity),
}))
@Table({ tableName: "verificationTokens" })
export class VerificationTokenEntity extends BaseEntity<VerificationTokenEntity> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public tokenId: string;

	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public tokenUuid: string;

	@ForeignKey(() => UserEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public tokenUserId: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public tokenIdentifier: string;

	@BelongsTo(() => UserEntity, {
		as: "tokenUser",
		foreignKey: "tokenUserId",
		targetKey: "userId",
	})
	public tokenUser: UserEntity;
}
