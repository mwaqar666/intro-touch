import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import type { ShareUserAccountRequestDto } from "@/backend/user/dto/share-user-account";
import { UpdateUserRequestDto } from "@/backend/user/dto/update-user/update-user-request.dto";
import { UserService } from "@/backend/user/services/user";

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

	public async viewUser(@Auth userEntity: UserEntity, @Path("userUuid") userUuid: string): Promise<{ user: UserEntity }> {
		await this.authorization.can(userEntity, [Permission.ViewUser]);

		return { user: await this.userService.viewUser(userUuid) };
	}

	public async updateUser(@Auth userEntity: UserEntity, @Path("userUuid") userUuid: string, @Body(UpdateUserRequestDto) updateUserRequestDto: UpdateUserRequestDto): Promise<{ user: UserEntity }> {
		await this.authorization.can(userEntity, [Permission.UpdateUser]);

		return { user: await this.userService.updateUser(userUuid, updateUserRequestDto) };
	}

	public async deleteUser(@Auth userEntity: UserEntity, @Path("userUuid") userUuid: string): Promise<{ deleted: boolean }> {
		await this.authorization.can(userEntity, [Permission.DeleteUser]);

		return { deleted: await this.userService.deleteUser(userUuid) };
	}

	public async publicPreview(@Path("userUsername") userUsername: string): Promise<{ user: UserEntity }> {
		return { user: await this.userService.getUserWithLiveProfile(userUsername) };
	}

	public async shareUserAccount(@Auth userEntity: UserEntity, @Body(ShareUserAccountRequestDto) shareUserAccountRequestDto: ShareUserAccountRequestDto): Promise<{ sent: boolean }> {
		return { sent: await this.userService.shareUserAccount(userEntity, shareUserAccountRequestDto) };
	}
}
