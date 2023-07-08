import type { UserEntity } from "@/backend/user/db/entities";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { VerificationTokenRepository } from "@/backend-core/authentication/db/repositories";

export class VerificationTokenService {
	public constructor(
		// Dependencies

		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(VerificationTokenRepository) private readonly verificationTokenRepository: VerificationTokenRepository,
	) {}

	public async markUserAsUnverified(userEntity: UserEntity): Promise<VerificationTokenEntity> {
		return await this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<VerificationTokenEntity> => {
				return await this.verificationTokenRepository.createOne({
					transaction: runningTransaction.transaction,
					valuesToCreate: { tokenUserId: userEntity.userId },
				});
			},
		});
	}

	public async markUserAsVerified(userEntity: UserEntity): Promise<boolean> {
		return await this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<boolean> => {
				return await this.verificationTokenRepository.delete({
					transaction: runningTransaction.transaction,
					findOptions: { where: { tokenUserId: userEntity.userId } },
				});
			},
		});
	}
}
