import { Body, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { LoginResponseDto } from "@/backend-core/authentication/dto/login";
import { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import { AuthService } from "@/backend-core/authentication/services";

@Controller
export class AuthenticationController {
	public constructor(
		// Dependencies

		@Inject(AuthService) private readonly authService: AuthService,
	) {}

	public async login(@Body(LoginRequestDto) loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
		return await this.authService.login(loginRequestDto);
	}
}
