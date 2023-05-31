import type { IRouter } from "@/backend/router/interface";
import { Token } from "ioc-class";
import type { UserController } from "@/backend/user/controller";
import type { UserService } from "@/backend/user/services";

export class UserTokenConst {
	public static readonly UserServiceToken: Token<UserService> = new Token<UserService>("UserServiceToken");
	public static readonly UserControllerToken: Token<UserController> = new Token<UserController>("UserControllerToken");
	public static readonly UserRouterToken: Token<IRouter> = new Token<IRouter>("UserRouterToken");
}
