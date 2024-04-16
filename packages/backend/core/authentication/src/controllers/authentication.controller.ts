import { Body, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import { VerifyEmailRequestDto } from "@/backend-core/authentication/dto/verify-email";
import { BasicAuthService } from "@/backend-core/authentication/services/auth";

@Controller
export class AuthenticationController {
	public constructor(
		// Dependencies

		@Inject(BasicAuthService) private readonly basicAuthService: BasicAuthService,
		// @Inject(SocialAuthService) private readonly socialAuthService: SocialAuthService,
	) {}

	public async basicLogin(@Body(LoginRequestDto) loginRequestDto: LoginRequestDto): Promise<{ token: string }> {
		return { token: await this.basicAuthService.basicLogin(loginRequestDto) };
	}

	public async basicRegister(@Body(RegisterRequestDto) registerRequestDto: RegisterRequestDto): Promise<{ registered: boolean }> {
		return { registered: await this.basicAuthService.basicRegister(registerRequestDto) };
	}

	public async verifyEmail(@Body(VerifyEmailRequestDto) verifyEmailRequestDto: VerifyEmailRequestDto): Promise<{ token: string }> {
		return { token: await this.basicAuthService.verifyUserEmail(verifyEmailRequestDto) };
	}

	public async resendEmailVerificationLink(@Body(ResendRequestDto) resendRequestDto: ResendRequestDto): Promise<{ resent: boolean }> {
		return { resent: await this.basicAuthService.resendUserEmailVerificationToken(resendRequestDto) };
	}

	// public async socialAuth(@Body(SocialAuthRequestDto) socialAuthRequestDto: SocialAuthRequestDto): Promise<Response> {
	// 	return await this.socialAuthService.socialAuth(socialAuthRequestDto);
	// }
}
