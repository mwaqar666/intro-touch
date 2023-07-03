import { Body, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { LoginResponseDto } from "@/backend-core/authentication/dto/login";
import { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import type { RegisterResponseDto } from "@/backend-core/authentication/dto/register";
import { RegisterRequestDto } from "@/backend-core/authentication/dto/register/register-request.dto";
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

	public async register(@Body(RegisterRequestDto) registerRequestDto: RegisterRequestDto): Promise<RegisterResponseDto> {
		return await this.authService.register(registerRequestDto);
	}
}
