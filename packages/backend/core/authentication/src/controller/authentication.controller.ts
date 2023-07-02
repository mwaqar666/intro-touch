import { Controller } from "@/backend-core/core/decorators";
import { Body } from "@/backend-core/request-processor/decorators";
import { ResponseHandler } from "@/backend-core/request-processor/extensions";
import type { ISuccessfulResponse } from "@/backend-core/request-processor/types";
import { Inject } from "iocc";
import { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import type { LoginResponseDto } from "@/backend-core/authentication/dto/login";
import { AuthService } from "@/backend-core/authentication/services/auth.service";

@Controller
export class AuthenticationController {
	public constructor(
		// Dependencies

		@Inject(AuthService) private readonly authenticationService: AuthService,
	) {}

	public async login(@Body(LoginRequestDto) loginRequestDto: LoginRequestDto): Promise<ISuccessfulResponse<LoginResponseDto>> {
		const loginResponse: LoginResponseDto = await this.authenticationService.login(loginRequestDto);

		return ResponseHandler.sendResponse(loginResponse);
	}
}
