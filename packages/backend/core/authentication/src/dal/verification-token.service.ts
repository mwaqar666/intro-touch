import type { UserEntity } from "@/backend/user/db/entities";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { TokenType } from "@/backend-core/authentication/db/enums";
import { VerificationTokenRepository } from "@/backend-core/authentication/db/repositories";

export class VerificationTokenService {
	public constructor(
		// Dependencies

		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(VerificationTokenRepository) private readonly verificationTokenRepository: VerificationTokenRepository,
	) {}

	public async createEmailVerificationToken(userEntity: UserEntity): Promise<VerificationTokenEntity> {
		return this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<VerificationTokenEntity> => {
				await this.verificationTokenRepository.purgeExistingVerificationTokens(userEntity, TokenType.EmailVerification, runningTransaction.transaction);

				return this.verificationTokenRepository.createVerificationToken(userEntity, TokenType.EmailVerification, runningTransaction.transaction);
			},
		});
	}

	public async verifyUserEmailVerificationToken(userEntity: UserEntity, tokenIdentifier: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<boolean> => {
				const verificationToken: Nullable<VerificationTokenEntity> = await this.verificationTokenRepository.findValidVerificationToken(userEntity, tokenIdentifier, TokenType.EmailVerification);

				if (!verificationToken) return false;

				await this.verificationTokenRepository.purgeExistingVerificationTokens(userEntity, TokenType.EmailVerification, runningTransaction.transaction);

				return true;
			},
		});
	}

	public async verifyUserEmailIsVerified(userEntity: UserEntity): Promise<boolean> {
		const emailVerificationTokens: Array<VerificationTokenEntity> = await this.verificationTokenRepository.getVerificationTokens(userEntity, TokenType.EmailVerification);

		return emailVerificationTokens.length === 0;
	}
}
