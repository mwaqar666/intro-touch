import { Controller, Request } from "@/backend-core/request-processor/decorators";
import type { IControllerAuthRequest, IControllerRequest } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
	) {}

	public async me(@Request request: IControllerAuthRequest<UserEntity>): Promise<{ user: UserEntity }> {
		return { user: request.auth };
	}

	public async getUserList(request: IControllerAuthRequest<UserEntity>, context: Context): Promise<{ users: Array<UserEntity> }> {
		return { users: await this.userService.getUserList(request, context) };
	}

	public async getUser(request: IControllerRequest, context: Context): Promise<string> {
		await this.userService.getUser(request, context);

		return "None";
	}

	public async createUser(request: IControllerRequest, context: Context): Promise<string> {
		await this.userService.createUser(request, context);

		return "None";
	}

	public async updateUser(request: IControllerRequest, context: Context): Promise<string> {
		await this.userService.updateUser(request, context);

		return "None";
	}

	public async deleteUser(request: IControllerRequest, context: Context): Promise<string> {
		await this.userService.deleteUser(request, context);

		return "None";
	}
}
