import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { VerificationTokenRepository } from "@/backend-core/authentication/db/repositories";
import type { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import type { VerifyRequestDto } from "@/backend-core/authentication/dto/verify";
import { TokenType } from "@/backend-core/authentication/enums";
import { InvalidCredentialsException } from "@/backend-core/authentication/exceptions";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";
import { EmailUtilService, TokenUtilService } from "@/backend-core/authentication/utils";

export class VerificationService {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(TokenUtilService) private readonly tokenUtilService: TokenUtilService,
		@Inject(EmailUtilService) private readonly emailUtilService: EmailUtilService,
		@Inject(VerificationTokenRepository) private readonly verificationTokenRepository: VerificationTokenRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async verifyRegisteredEmail({ userEmail, tokenIdentifier }: VerifyRequestDto): Promise<string> {
		const user: UserEntity = await this.userAuthService.retrieveUserByCredentials({ userEmail }, true);

		const userVerified: boolean = await this.verifyUserEmailVerificationToken(user, tokenIdentifier);
		if (!userVerified) throw new InvalidCredentialsException();

		return this.tokenUtilService.createAuthenticationToken(user);
	}

	public async resendEmailVerificationToken({ userEmail }: ResendRequestDto): Promise<boolean> {
		const user: UserEntity = await this.userAuthService.retrieveUserByCredentials({ userEmail }, true);

		const verificationToken: VerificationTokenEntity = await this.createEmailVerificationToken(user);

		await this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);

		return true;
	}

	public async verifyUserEmailIsVerified(authEntity: IAuthenticatableEntity): Promise<boolean> {
		const emailVerificationTokens: Array<VerificationTokenEntity> = await this.verificationTokenRepository.getVerificationTokens(authEntity, TokenType.EmailVerification);

		return emailVerificationTokens.length === 0;
	}

	private async verifyUserEmailVerificationToken(authEntity: IAuthenticatableEntity, tokenIdentifier: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<boolean> => {
				const verificationToken: Nullable<VerificationTokenEntity> = await this.verificationTokenRepository.findValidVerificationToken(authEntity, tokenIdentifier, TokenType.EmailVerification);

				if (!verificationToken) return false;

				await this.verificationTokenRepository.purgeExistingVerificationTokens(authEntity, TokenType.EmailVerification, runningTransaction.transaction);

				return true;
			},
		});
	}

	private async createEmailVerificationToken(authEntity: IAuthenticatableEntity): Promise<VerificationTokenEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<VerificationTokenEntity> => {
				await this.verificationTokenRepository.purgeExistingVerificationTokens(authEntity, TokenType.EmailVerification, transaction);

				return this.verificationTokenRepository.createVerificationToken(authEntity, TokenType.EmailVerification, transaction);
			},
		});
	}
}
