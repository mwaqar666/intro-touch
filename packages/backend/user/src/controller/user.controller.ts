import { Controller } from "@/backend-core/core/decorators";
import { ResponseExtension } from "@/backend-core/request-processor/extensions";
import type { IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";
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

	public async getUserList(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.getUserList(request, context);

		return ResponseExtension.sendResponse("None");
	}

	public async getUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.getUser(request, context);

		return ResponseExtension.sendResponse("None");
	}

	public async createUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.createUser(request, context);

		return ResponseExtension.sendResponse("None");
	}

	public async updateUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.updateUser(request, context);

		return ResponseExtension.sendResponse("None");
	}

	public async deleteUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.deleteUser(request, context);

		return ResponseExtension.sendResponse("None");
	}
}
