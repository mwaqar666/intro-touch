import type { UserEntity } from "@/backend/user/db/entities";
import { UserRepository } from "@/backend/user/db/repositories";
import { EntityScopeConst } from "@/backend-core/database/const";
import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { LoginRequestDto, LoginResponseDto } from "@/backend-core/authentication/dto/login";
import { AuthTokenService } from "@/backend-core/authentication/services/auth-token.service";

export class AuthService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(AuthTokenService) private readonly authTokenService: AuthTokenService,
	) {}

	public async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
		const { userEmail, userPassword }: LoginRequestDto = loginRequest;

		const user: Nullable<UserEntity> = await this.userRepository.findOne({
			findOptions: { where: { userEmail } },
			scopes: [EntityScopeConst.isActive],
		});

		if (!user) throw new UnauthorizedException("Invalid Credentials");

		const passwordMatched: boolean = await user.comparePassword(userPassword);

		if (!passwordMatched) throw new UnauthorizedException("Invalid Credentials");

		return {
			token: await this.authTokenService.createAuthenticationToken(user),
		};
	}
}
