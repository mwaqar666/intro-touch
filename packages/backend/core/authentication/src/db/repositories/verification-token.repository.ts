import type { UserEntity } from "@/backend/user/db/entities";
import { BaseRepository } from "@/backend-core/database/repository";
import type { Nullable } from "@/stacks/types";
import ms from "ms";
import type { Transaction } from "sequelize";
import { Op } from "sequelize";
import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import type { TokenType } from "@/backend-core/authentication/db/enums";

export class VerificationTokenRepository extends BaseRepository<VerificationTokenEntity> {
	public constructor() {
		super(VerificationTokenEntity);
	}

	public async getVerificationTokens(userEntity: UserEntity, tokenType: TokenType): Promise<Array<VerificationTokenEntity>> {
		return this.findAll({
			findOptions: {
				where: {
					tokenUserId: userEntity.userId,
					tokenType: tokenType,
				},
			},
		});
	}

	public async purgeExistingVerificationTokens(userEntity: UserEntity, tokenType: TokenType, transaction: Transaction): Promise<void> {
		await this.deleteMany({
			findOptions: {
				where: {
					tokenUserId: userEntity.userId,
					tokenType: tokenType,
				},
			},
			transaction,
		});
	}

	public async createVerificationToken(userEntity: UserEntity, tokenType: TokenType, transaction: Transaction): Promise<VerificationTokenEntity> {
		const tokenExpiry: Date = new Date(Date.now() + ms("1d"));

		return this.createOne({
			valuesToCreate: {
				tokenUserId: userEntity.userId,
				tokenType,
				tokenExpiry,
			},
			transaction,
		});
	}

	public async findValidVerificationToken(userEntity: UserEntity, tokenIdentifier: string, tokenType: TokenType): Promise<Nullable<VerificationTokenEntity>> {
		const currentTimestamp: Date = new Date();

		return await this.findOne({
			findOptions: {
				where: {
					tokenUserId: userEntity.userId,
					tokenType,
					tokenIdentifier,
					tokenExpiry: {
						[Op.gt]: currentTimestamp,
					},
				},
			},
		});
	}
}
