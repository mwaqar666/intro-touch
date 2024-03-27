import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { TokenType } from "@/backend-core/authentication/db/enums";
import { VerificationTokenRepository } from "@/backend-core/authentication/db/repositories";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";

export class VerificationTokenService {
	public constructor(
		// Dependencies

		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(VerificationTokenRepository) private readonly verificationTokenRepository: VerificationTokenRepository,
	) {}

	public async createEmailVerificationToken(authEntity: IAuthenticatableEntity): Promise<VerificationTokenEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<VerificationTokenEntity> => {
				await this.verificationTokenRepository.purgeExistingVerificationTokens(authEntity, TokenType.EmailVerification, transaction);

				return this.verificationTokenRepository.createVerificationToken(authEntity, TokenType.EmailVerification, transaction);
			},
		});
	}

	public async verifyUserEmailVerificationToken(authEntity: IAuthenticatableEntity, tokenIdentifier: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<boolean> => {
				const verificationToken: Nullable<VerificationTokenEntity> = await this.verificationTokenRepository.findValidVerificationToken(authEntity, tokenIdentifier, TokenType.EmailVerification);

				if (!verificationToken) return false;

				await this.verificationTokenRepository.purgeExistingVerificationTokens(authEntity, TokenType.EmailVerification, runningTransaction.transaction);

				return true;
			},
		});
	}

	public async verifyUserEmailIsVerified(authEntity: IAuthenticatableEntity): Promise<boolean> {
		const emailVerificationTokens: Array<VerificationTokenEntity> = await this.verificationTokenRepository.getVerificationTokens(authEntity, TokenType.EmailVerification);

		return emailVerificationTokens.length === 0;
	}
}
