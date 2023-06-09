import { Controller } from "@/backend-core/core/decorators";
import type { IRequest, IResponse } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { UserTokenConst } from "@/backend/user/const";
import type { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserTokenConst.UserServiceToken) private readonly userService: UserService,
	) {}

	public async getUserList(request: IRequest, context: Context): Promise<IResponse> {
		await this.userService.getUserList(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public async getUser(request: IRequest, context: Context): Promise<IResponse> {
		await this.userService.getUser(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public async createUser(request: IRequest, context: Context): Promise<IResponse> {
		await this.userService.createUser(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public async updateUser(request: IRequest, context: Context): Promise<IResponse> {
		await this.userService.updateUser(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public async deleteUser(request: IRequest, context: Context): Promise<IResponse> {
		await this.userService.deleteUser(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}
}
