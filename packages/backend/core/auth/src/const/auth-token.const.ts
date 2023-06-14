import { Token } from "iocc";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/auth/interface";
import type { IFacebookAdapter, IGoogleAdapter } from "@/backend-core/auth/types";

export class AuthTokenConst {
	public static readonly AuthAdapterResolverToken: Token<IAuthAdapterResolver> = new Token<IAuthAdapterResolver>("AuthAdapterResolver");

	public static readonly GoogleAdapterToken: Token<IAuthAdapter<IGoogleAdapter>> = new Token<IAuthAdapter<IGoogleAdapter>>("GoogleAdapter");
	public static readonly FacebookAdapterToken: Token<IAuthAdapter<IFacebookAdapter>> = new Token<IAuthAdapter<IFacebookAdapter>>("FacebookAdapter");
}
