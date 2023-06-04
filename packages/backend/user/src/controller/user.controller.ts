import { Controller } from "@/backend/core/decorators";
import type { IRequest, IResponse } from "@/backend/router/interface";
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

	public getUserList(_request: IRequest, _context: Context): IResponse {
		this.userService.getUserList();

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public getUser(_request: IRequest, _context: Context): IResponse {
		this.userService.getUser();

		return {
			body: "None",
			statusCode: 200,
		};
	}

	public deleteUser(_request: IRequest, _context: Context): IResponse {
		this.userService.deleteUser();

		return {
			body: "None",
			statusCode: 200,
		};
	}
}
