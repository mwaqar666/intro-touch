import type { UserEntity } from "@/backend/user/db/entities";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { TokenTypeEnum } from "@/backend-core/authentication/db/enums";
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
				await this.verificationTokenRepository.purgeExistingVerificationTokens(userEntity, TokenTypeEnum.EMAIL_VERIFICATION, runningTransaction.transaction);

				return this.verificationTokenRepository.createVerificationToken(userEntity, TokenTypeEnum.EMAIL_VERIFICATION, runningTransaction.transaction);
			},
		});
	}

	public async verifyUserEmailVerificationToken(userEntity: UserEntity, tokenIdentifier: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<boolean> => {
				const verificationToken: Nullable<VerificationTokenEntity> = await this.verificationTokenRepository.findValidVerificationToken(userEntity, tokenIdentifier, TokenTypeEnum.EMAIL_VERIFICATION);

				if (!verificationToken) return false;

				await this.verificationTokenRepository.purgeExistingVerificationTokens(userEntity, TokenTypeEnum.EMAIL_VERIFICATION, runningTransaction.transaction);

				return true;
			},
		});
	}

	public async verifyUserEmailIsVerified(userEntity: UserEntity): Promise<boolean> {
		const emailVerificationTokens: Array<VerificationTokenEntity> = await this.verificationTokenRepository.getVerificationTokens(userEntity, TokenTypeEnum.EMAIL_VERIFICATION);

		return emailVerificationTokens.length === 0;
	}
}
