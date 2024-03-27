import { BaseRepository } from "@/backend-core/database/repository";
import type { Nullable } from "@/stacks/types";
import ms from "ms";
import type { Transaction } from "sequelize";
import { Op } from "sequelize";
import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import type { TokenType } from "@/backend-core/authentication/db/enums";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";

export class VerificationTokenRepository extends BaseRepository<VerificationTokenEntity> {
	public constructor() {
		super(VerificationTokenEntity);
	}

	public async getVerificationTokens(authEntity: IAuthenticatableEntity, tokenType: TokenType): Promise<Array<VerificationTokenEntity>> {
		return this.findAll({
			findOptions: {
				where: {
					tokenUserId: authEntity.getAuthPrimaryKey(),
					tokenType: tokenType,
				},
			},
		});
	}

	public async purgeExistingVerificationTokens(authEntity: IAuthenticatableEntity, tokenType: TokenType, transaction: Transaction): Promise<void> {
		await this.deleteMany({
			findOptions: {
				where: {
					tokenUserId: authEntity.getAuthPrimaryKey(),
					tokenType: tokenType,
				},
			},
			transaction,
		});
	}

	public async createVerificationToken(authEntity: IAuthenticatableEntity, tokenType: TokenType, transaction: Transaction): Promise<VerificationTokenEntity> {
		const tokenExpiry: Date = new Date(Date.now() + ms("1d"));

		return this.createOne({
			valuesToCreate: {
				tokenUserId: authEntity.getAuthPrimaryKey(),
				tokenType,
				tokenExpiry,
			},
			transaction,
		});
	}

	public async findValidVerificationToken(authEntity: IAuthenticatableEntity, tokenIdentifier: string, tokenType: TokenType): Promise<Nullable<VerificationTokenEntity>> {
		const currentTimestamp: Date = new Date();

		return await this.findOne({
			findOptions: {
				where: {
					tokenUserId: authEntity.getAuthPrimaryKey(),
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
