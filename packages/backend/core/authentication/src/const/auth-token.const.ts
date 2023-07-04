import { Token } from "iocc";
import type { IAuthAdapter, IAuthAdapterResolver, IGuardResolver } from "@/backend-core/authentication/interface";
import type { IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthTokenConst {
	public static readonly SelfAdapterToken: Token<IAuthAdapter> = new Token<IAuthAdapter>("SelfAdapter");
	public static readonly GoogleAdapterToken: Token<IAuthAdapter<IGoogleAdapter>> = new Token<IAuthAdapter<IGoogleAdapter>>("GoogleAdapter");

	public static readonly AuthAdapterResolverToken: Token<IAuthAdapterResolver> = new Token<IAuthAdapterResolver>("AuthAdapterResolver");
	public static readonly GuardResolverToken: Token<IGuardResolver> = new Token<IGuardResolver>("GuardResolver");
}
