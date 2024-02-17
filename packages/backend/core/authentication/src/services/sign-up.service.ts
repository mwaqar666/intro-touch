import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import { Inject } from "iocc";
import { VerificationTokenService } from "@/backend-core/authentication/dal";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import type { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import { EmailUtilService } from "@/backend-core/authentication/utils";

export class SignUpService {
	public constructor(
		// Dependencies
		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(EmailUtilService) private readonly emailUtilService: EmailUtilService,
		@Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async basicRegister(registerRequestDto: RegisterRequestDto): Promise<boolean> {
		const user: UserEntity = await this.userAuthService.createNewUserWithProfile(registerRequestDto);

		const verificationToken: VerificationTokenEntity = await this.verificationTokenService.createEmailVerificationToken(user);

		await this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);

		return true;
	}
}
