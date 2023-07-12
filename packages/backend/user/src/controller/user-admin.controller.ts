import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import type { DeleteUserResponseDto } from "@/backend/user/dto/delete-user";
import type { ListUserResponseDto } from "@/backend/user/dto/list-user";
import type { UpdateUserResponseDto } from "@/backend/user/dto/update-user";
import { UpdateUserRequestDto } from "@/backend/user/dto/update-user";
import type { ViewUserResponseDto } from "@/backend/user/dto/view-user";
import { UserService } from "@/backend/user/services";

@Controller
export class UserAdminController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async listUser(@Auth authEntity: UserEntity): Promise<ListUserResponseDto> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_USER, PermissionsEnum.VIEW_USER]);

		return { users: await this.userService.listUser() };
	}

	public async viewUser(@Auth authEntity: UserEntity, @Path("userUuid") userUuid: string): Promise<ViewUserResponseDto> {
		await this.authorization.can(authEntity, [PermissionsEnum.VIEW_USER]);

		return { user: await this.userService.viewUser(userUuid) };
	}

	public async updateUser(@Auth authEntity: UserEntity, @Path("userUuid") userUuid: string, @Body(UpdateUserRequestDto) updateUserRequestDto: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
		await this.authorization.can(authEntity, [PermissionsEnum.UPDATE_USER]);

		return { user: await this.userService.updateUser(userUuid, updateUserRequestDto) };
	}

	public async deleteUser(@Auth authEntity: UserEntity, @Path("userUuid") userUuid: string): Promise<DeleteUserResponseDto> {
		await this.authorization.can(authEntity, [PermissionsEnum.DELETE_USER]);

		return { userDeleted: await this.userService.deleteUser(userUuid) };
	}
}
