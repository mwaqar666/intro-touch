import { Controller } from "@/backend-core/core/decorators";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
		@Inject(RequestProcessorTokenConst.ResponseHandler) private readonly responseHandler: IResponseHandler,
	) {}

	public async getUserList(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.getUserList(request, context);

		return this.responseHandler.sendResponse("None");
	}

	public async getUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.getUser(request, context);

		return this.responseHandler.sendResponse("None");
	}

	public async createUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.createUser(request, context);

		return this.responseHandler.sendResponse("None");
	}

	public async updateUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.updateUser(request, context);

		return this.responseHandler.sendResponse("None");
	}

	public async deleteUser(request: IControllerRequest, context: Context): Promise<ISuccessfulResponse<string>> {
		await this.userService.deleteUser(request, context);

		return this.responseHandler.sendResponse("None");
	}
}
