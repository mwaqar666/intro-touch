import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import { Inject } from "iocc";
import { VerificationTokenService } from "@/backend-core/authentication/dal";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import type { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import type { VerifyRequestDto } from "@/backend-core/authentication/dto/verify";
import { InvalidCredentialsException } from "@/backend-core/authentication/exceptions";
import { EmailUtilService, TokenUtilService } from "@/backend-core/authentication/utils";

export class VerificationService {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(TokenUtilService) private readonly tokenUtilService: TokenUtilService,
		@Inject(EmailUtilService) private readonly emailUtilService: EmailUtilService,
		@Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async verifyRegisteredEmail({ userEmail, tokenIdentifier }: VerifyRequestDto): Promise<string> {
		const user: UserEntity = await this.userAuthService.retrieveUserByCredentials({ userEmail }, true);

		const userVerified: boolean = await this.verificationTokenService.verifyUserEmailVerificationToken(user, tokenIdentifier);
		if (!userVerified) throw new InvalidCredentialsException();

		return this.tokenUtilService.createAuthenticationToken(user);
	}

	public async resendEmailVerificationToken({ userEmail }: ResendRequestDto): Promise<boolean> {
		const user: UserEntity = await this.userAuthService.retrieveUserByCredentials({ userEmail }, true);

		const verificationToken: VerificationTokenEntity = await this.verificationTokenService.createEmailVerificationToken(user);

		await this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);

		return true;
	}
}
