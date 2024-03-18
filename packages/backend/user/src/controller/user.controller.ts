import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { ResetPasswordRequestDto } from "@/backend/user/dto/reset-password";
import { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async me(@Auth userEntity: UserEntity): Promise<{ user: UserEntity }> {
		return { user: await this.userService.getUserWithLiveProfile(userEntity) };
	}

	public async publicPreview(@Path("userUsername") userUsername: string): Promise<{ user: UserEntity }> {
		return { user: await this.userService.getUserWithLiveProfile(userUsername) };
	}

	public async resetPassword(@Auth authEntity: UserEntity, @Body(ResetPasswordRequestDto) resetPasswordRequestDto: ResetPasswordRequestDto): Promise<{ user: UserEntity }> {
		// await this.authorization.can(authEntity, [Permission.RESET_PASSWORD]);

		return { user: await this.userService.resetPassword(authEntity.userId, resetPasswordRequestDto) };
	}
}
