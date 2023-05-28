import type { IRequest, IResponse } from "@/backend/router/interface";
import type { Context } from "aws-lambda";
import { Inject } from "typedi";
import { UserTokenConst } from "@/backend/user/const";
import type { UserService } from "@/backend/user/services";

// @Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserTokenConst.UserServiceToken) private readonly userService: UserService,
	) {}

	public getUserList(request: IRequest, context: Context): IResponse {
		console.log(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public getUser(request: IRequest, context: Context): IResponse {
		console.log(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public deleteUser(request: IRequest, context: Context): IResponse {
		console.log(request, context);

		return {
			body: "None",
			statusCode: 200,
		};
	}
}
