import { Token } from "typedi";
import type { UserController } from "@/backend/user/controller";

export class UserTokenConst {
	public static readonly UserControllerToken: Token<UserController> = new Token<UserController>("UserController");
}
