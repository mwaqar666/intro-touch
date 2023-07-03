import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { LoginRequestDto, LoginResponseDto } from "@/backend-core/authentication/dto/login";
import type { RegisterRequestDto, RegisterResponseDto } from "@/backend-core/authentication/dto/register";
import { InvalidCredentialsException } from "@/backend-core/authentication/exceptions";
import { AuthTokenService } from "@/backend-core/authentication/services/token";

export class AuthService {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(AuthTokenService) private readonly authTokenService: AuthTokenService,
	) {}

	public async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
		const { userEmail, userPassword }: LoginRequestDto = loginRequest;

		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(userEmail);

		if (!user) throw new InvalidCredentialsException();

		const passwordVerified: boolean = await user.verifyPassword(userPassword);

		if (!passwordVerified) throw new InvalidCredentialsException();

		return {
			token: await this.authTokenService.createAuthenticationToken(user),
		};
	}

	public async register(registerRequestDto: RegisterRequestDto): Promise<RegisterResponseDto> {
		const user: UserEntity = await this.userAuthService.createNewUserWithProfile(registerRequestDto);

		return {
			token: await this.authTokenService.createAuthenticationToken(user),
		};
	}
}
