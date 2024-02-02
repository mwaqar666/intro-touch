import type { UserEntity } from "@/backend/user/db/entities";
import { Body, Controller } from "@/backend-core/request-processor/decorators";
import type { ISuccessfulResponse } from "@/backend-core/request-processor/types";
import { Inject } from "iocc";
import { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import { SocialAuthRequestDto } from "@/backend-core/authentication/dto/social-auth";
import { VerifyRequestDto } from "@/backend-core/authentication/dto/verify";
import { AuthenticationService } from "@/backend-core/authentication/services";
import { AuthRedirectionService } from "@/backend-core/authentication/services/auth-utils";

@Controller
export class AuthenticationController {
	public constructor(
		// Dependencies

		@Inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
		@Inject(AuthRedirectionService) private readonly authRedirectionService: AuthRedirectionService,
	) {}

	public async basicLogin(@Body(LoginRequestDto) loginRequestDto: LoginRequestDto): Promise<{ token: string }> {
		return { token: await this.authenticationService.basicLogin(loginRequestDto) };
	}

	public async basicRegister(@Body(RegisterRequestDto) registerRequestDto: RegisterRequestDto): Promise<{ registered: boolean }> {
		return { registered: await this.authenticationService.basicRegister(registerRequestDto) };
	}

	public async verifyRegisteredEmail(@Body(VerifyRequestDto) verifyRequestDto: VerifyRequestDto): Promise<{ token: string }> {
		return { token: await this.authenticationService.verifyRegisteredEmail(verifyRequestDto) };
	}

	public async resendEmailVerificationToken(@Body(ResendRequestDto) resendRequestDto: ResendRequestDto): Promise<{ resent: boolean }> {
		return { resent: await this.authenticationService.resendEmailVerificationToken(resendRequestDto) };
	}

	public async socialAuth(@Body(SocialAuthRequestDto) socialAuthRequestDto: SocialAuthRequestDto): Promise<ISuccessfulResponse<void>> {
		const foundOrCreatedUser: [UserEntity, boolean] = await this.authenticationService.findOrCreateUser(socialAuthRequestDto);

		return this.authRedirectionService.prepareRedirectionResponse(...foundOrCreatedUser);
	}
}
