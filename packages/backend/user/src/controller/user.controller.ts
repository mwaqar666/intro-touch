import { Controller } from "@/backend-core/request-processor/decorators";
import { ResponseHandler } from "@/backend-core/request-processor/extensions";
import type { IControllerAuthRequest, IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";
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

	public async getUserList(request: IControllerAuthRequest<UserEntity>, context: Context): Promise<ISuccessfulResponse<Array<UserEntity>>> {
		const userList: Array<UserEntity> = await this.userService.getUserList(request, context);

		return ResponseHandler.sendResponse(userList);
	}

	public async getUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.getUser(request, context);

		return ResponseHandler.sendResponse("None");
	}

	public async createUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.createUser(request, context);

		return ResponseHandler.sendResponse("None");
	}

	public async updateUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.updateUser(request, context);

		return ResponseHandler.sendResponse("None");
	}

	public async deleteUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.deleteUser(request, context);

		return ResponseHandler.sendResponse("None");
	}
}
