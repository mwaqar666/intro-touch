import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { RolesEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import type { DeleteUserResponseDto } from "@/backend/user/dto/delete-user";
import { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async me(@Auth authEntity: UserEntity): Promise<{ user: UserEntity }> {
		return { user: authEntity };
	}

	public async deleteAccount(@Auth authEntity: UserEntity): Promise<DeleteUserResponseDto> {
		await this.authorization.is(authEntity, [RolesEnum.ADMIN, RolesEnum.CUSTOMER]);

		return { userDeleted: await this.userService.deleteUser(authEntity.userUuid) };
	}
}
