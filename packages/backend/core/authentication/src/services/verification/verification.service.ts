import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Exception } from "@/backend-core/request-processor/exceptions";
import type { Constructable, Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { VerificationTokenRepository } from "@/backend-core/authentication/db/repositories";
import type { TokenType } from "@/backend-core/authentication/enums";
import { InvalidTokenException } from "@/backend-core/authentication/exceptions";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";

export class VerificationService {
	public constructor(
		// Dependencies

		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(VerificationTokenRepository) private readonly verificationTokenRepository: VerificationTokenRepository,
	) {}

	public async createVerificationToken(authEntity: IAuthenticatableEntity, tokenType: TokenType): Promise<VerificationTokenEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<VerificationTokenEntity> => {
				await this.verificationTokenRepository.purgeExistingVerificationTokens(authEntity, tokenType, transaction);

				return this.verificationTokenRepository.createVerificationToken(authEntity, tokenType, transaction);
			},
		});
	}

	public async validateVerificationToken(authEntity: IAuthenticatableEntity, tokenIdentifier: string, tokenType: TokenType): Promise<void> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const verificationToken: Nullable<VerificationTokenEntity> = await this.verificationTokenRepository.findValidVerificationToken(authEntity, tokenIdentifier, tokenType);

				if (!verificationToken) throw new InvalidTokenException();

				await this.verificationTokenRepository.purgeExistingVerificationTokens(authEntity, tokenType, transaction);
			},
		});
	}

	public async validateUserHasNoVerificationTokens(authEntity: IAuthenticatableEntity, tokenType: TokenType, exception: Constructable<Exception<unknown>>): Promise<void> {
		const verificationTokenEntities: Array<VerificationTokenEntity> = await this.verificationTokenRepository.getVerificationTokens(authEntity, tokenType);

		if (verificationTokenEntities.length === 0) return;

		throw new exception();
	}
}
