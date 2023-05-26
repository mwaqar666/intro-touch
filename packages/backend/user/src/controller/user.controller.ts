import { Controller } from "@/backend/core/decorators";
import type { IRequest, IResponse } from "@/backend/router/interface";
import type { Context } from "aws-lambda";
import type { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		private readonly userService: UserService,
	) {}

	public getUserList(request: IRequest, context: Context): IResponse {
		console.log(request, context);
		this.userService.getUserList();

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public getUser(request: IRequest, context: Context): IResponse {
		console.log(request, context);
		this.userService.getUser();

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public deleteUser(request: IRequest, context: Context): IResponse {
		console.log(request, context);
		this.userService.deleteUser();

		return {
			body: "None",
			statusCode: 200,
		};
	}
}
