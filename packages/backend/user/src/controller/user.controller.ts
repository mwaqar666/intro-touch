import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { ChangePasswordRequestDto } from "@/backend/user/dto/change-password";
import { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getUserList(@Auth userEntity: UserEntity): Promise<{ users: Array<UserEntity> }> {
		await this.authorization.can(userEntity, [Permission.ListUser]);

		return { users: await this.userService.getUserList() };
	}

	public async me(@Auth userEntity: UserEntity): Promise<{ user: UserEntity }> {
		return { user: await this.userService.getUserWithLiveProfile(userEntity) };
	}

	public async publicPreview(@Path("userUsername") userUsername: string): Promise<{ user: UserEntity }> {
		return { user: await this.userService.getUserWithLiveProfile(userUsername) };
	}

	public async changePassword(@Auth userEntity: UserEntity, @Body(ChangePasswordRequestDto) resetPasswordRequestDto: ChangePasswordRequestDto): Promise<{ user: UserEntity }> {
		await this.authorization.can(userEntity, [Permission.ResetPassword]);

		return { user: await this.userService.resetPassword(userEntity, resetPasswordRequestDto) };
	}
}
