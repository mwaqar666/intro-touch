import { Token } from "iocc";
import type { IAuthorization } from "@/backend-core/authorization/interface";

export class AuthorizationTokenConst {
	public static readonly Authorization: Token<IAuthorization> = new Token<IAuthorization>("Authorization");
}
