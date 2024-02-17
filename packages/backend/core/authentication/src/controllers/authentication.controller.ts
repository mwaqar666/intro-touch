import { Body, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import { VerifyRequestDto } from "@/backend-core/authentication/dto/verify";
import { SignInService, SignUpService, VerificationService } from "@/backend-core/authentication/services";

@Controller
export class AuthenticationController {
	public constructor(
		// Dependencies

		@Inject(SignInService) private readonly signInService: SignInService,
		@Inject(SignUpService) private readonly signUpService: SignUpService,
		// @Inject(SocialAuthService) private readonly socialAuthService: SocialAuthService,
		@Inject(VerificationService) private readonly verificationService: VerificationService,
	) {}

	public async basicLogin(@Body(LoginRequestDto) loginRequestDto: LoginRequestDto): Promise<{ token: string }> {
		return { token: await this.signInService.basicLogin(loginRequestDto) };
	}

	public async basicRegister(@Body(RegisterRequestDto) registerRequestDto: RegisterRequestDto): Promise<{ registered: boolean }> {
		return { registered: await this.signUpService.basicRegister(registerRequestDto) };
	}

	public async verifyRegisteredEmail(@Body(VerifyRequestDto) verifyRequestDto: VerifyRequestDto): Promise<{ token: string }> {
		return { token: await this.verificationService.verifyRegisteredEmail(verifyRequestDto) };
	}

	public async resendEmailVerificationToken(@Body(ResendRequestDto) resendRequestDto: ResendRequestDto): Promise<{ resent: boolean }> {
		return { resent: await this.verificationService.resendEmailVerificationToken(resendRequestDto) };
	}

	// public async socialAuth(@Body(SocialAuthRequestDto) socialAuthRequestDto: SocialAuthRequestDto): Promise<Response> {
	// 	return await this.socialAuthService.socialAuth(socialAuthRequestDto);
	// }
}
