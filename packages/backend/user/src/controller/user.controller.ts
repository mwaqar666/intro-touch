import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
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

	public async getUserList(@Auth authEntity: UserEntity): Promise<{ users: Array<UserEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_USER]);

		return { users: await this.userService.getUserList(authEntity) };
	}

	public async getUser(@Auth user: UserEntity): Promise<string> {
		await this.userService.getUser(user);

		return "None";
	}

	public async createUser(@Auth user: UserEntity): Promise<string> {
		await this.userService.createUser(user);

		return "None";
	}

	public async updateUser(@Auth user: UserEntity): Promise<string> {
		await this.userService.updateUser(user);

		return "None";
	}

	public async deleteUser(@Auth user: UserEntity): Promise<string> {
		await this.userService.deleteUser(user);

		return "None";
	}
}
