import { Token } from "iocc";
import type { UserAuthService } from "@/backend/user/services";

export class UserConst {
	public static readonly UserAuthServiceToken: Token<UserAuthService> = new Token<UserAuthService>("UserAuthService");
}
