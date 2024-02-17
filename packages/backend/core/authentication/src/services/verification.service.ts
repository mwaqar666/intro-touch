import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { Nullable } from "@/stacks/types";
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

	public async verifyRegisteredEmail(verifyRequestDto: VerifyRequestDto): Promise<string> {
		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(verifyRequestDto.userEmail);
		if (!user) throw new InvalidCredentialsException();

		const userVerified: boolean = await this.verificationTokenService.verifyUserEmailVerificationToken(user, verifyRequestDto.tokenIdentifier);
		if (!userVerified) throw new InvalidCredentialsException();

		return this.tokenUtilService.createAuthenticationToken(user);
	}

	public async resendEmailVerificationToken(resendRequestDto: ResendRequestDto): Promise<boolean> {
		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(resendRequestDto.userEmail);
		if (!user) throw new InvalidCredentialsException();

		const verificationToken: VerificationTokenEntity = await this.verificationTokenService.createEmailVerificationToken(user);

		await this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);

		return true;
	}
}
