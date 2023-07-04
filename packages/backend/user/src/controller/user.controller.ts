import { Auth, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
	) {}

	public async me(@Auth user: UserEntity): Promise<{ user: UserEntity }> {
		return { user };
	}

	public async getUserList(@Auth user: UserEntity): Promise<{ users: Array<UserEntity> }> {
		return { users: await this.userService.getUserList(user) };
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
