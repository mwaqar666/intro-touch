import type { IRouter } from "@/backend-core/router/interface";
import { Token } from "iocc";
import type { UserController } from "@/backend/user/controller";
import type { UserRepository } from "@/backend/user/repository";
import type { UserService } from "@/backend/user/services";

export class UserTokenConst {
	public static readonly UserServiceToken: Token<UserService> = new Token<UserService>("UserServiceToken");
	public static readonly UserControllerToken: Token<UserController> = new Token<UserController>("UserControllerToken");
	public static readonly UserRepositoryToken: Token<UserRepository> = new Token<UserRepository>("UserRepositoryToken");
	public static readonly UserRouterToken: Token<IRouter> = new Token<IRouter>("UserRouterToken");
}
