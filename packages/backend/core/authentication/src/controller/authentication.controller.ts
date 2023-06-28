import { Controller } from "@/backend-core/core/decorators";
import { ResponseHandler } from "@/backend-core/request-processor/extensions";
import type { IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";
import { Inject } from "iocc";
import type { LoginRequestDto, LoginResponseDto } from "@/backend-core/authentication/dto/login";
import { AuthService } from "@/backend-core/authentication/services/auth.service";

@Controller
export class AuthenticationController {
	public constructor(
		// Dependencies

		@Inject(AuthService) private readonly authenticationService: AuthService,
	) {}

	public async login(request: IControllerRequest<LoginRequestDto>): Promise<ISuccessfulResponse<LoginResponseDto>> {
		const loginRequest: LoginRequestDto = request.body;

		const loginResponse: LoginResponseDto = await this.authenticationService.login(loginRequest);

		return ResponseHandler.sendResponse(loginResponse);
	}
}
