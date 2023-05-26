import type { IRouter } from "@/backend/router/interface";
import { Token } from "typedi";

export class UserTokenConst {
	public static readonly UserRouterToken: Token<IRouter> = new Token<IRouter>("UserRouterToken");
}
