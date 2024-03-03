import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import { VerificationTokenService } from "@/backend-core/authentication/dal";
import type { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import { EmailNotVerifiedException, InvalidCredentialsException } from "@/backend-core/authentication/exceptions";
import { TokenUtilService } from "@/backend-core/authentication/utils";

export class SignInService {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(TokenUtilService) private readonly tokenUtilService: TokenUtilService,
		@Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async basicLogin(loginRequestDto: LoginRequestDto): Promise<string> {
		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(loginRequestDto.userEmail);
		if (!user) throw new InvalidCredentialsException();

		const passwordVerified: boolean = await user.verifyPassword(loginRequestDto.userPassword);
		if (!passwordVerified) throw new InvalidCredentialsException();

		const userIsVerified: boolean = await this.verificationTokenService.verifyUserEmailIsVerified(user);
		if (!userIsVerified) throw new EmailNotVerifiedException();

		return this.tokenUtilService.createAuthenticationToken(user);
	}
}
