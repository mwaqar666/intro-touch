import { Token } from "iocc";
import type { IAuthAdapter, IAuthAdapterResolver, IAuthProvider, IGuardResolver, IPasswordManager } from "@/backend-core/authentication/interface";
import type { IFacebookAdapter, IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthenticationTokenConst {
	public static readonly SelfAdapterToken: Token<IAuthAdapter> = new Token<IAuthAdapter>("SelfAdapter");
	public static readonly GoogleAdapterToken: Token<IAuthAdapter<IGoogleAdapter>> = new Token<IAuthAdapter<IGoogleAdapter>>("GoogleAdapter");
	public static readonly FacebookAdapterToken: Token<IAuthAdapter<IFacebookAdapter>> = new Token<IAuthAdapter<IFacebookAdapter>>("FacebookAdapter");

	public static readonly AuthProviderToken: Token<IAuthProvider> = new Token<IAuthProvider>("AuthProvider");
	public static readonly PasswordManagerToken: Token<IPasswordManager> = new Token<IPasswordManager>("PasswordManager");

	public static readonly AuthAdapterResolverToken: Token<IAuthAdapterResolver> = new Token<IAuthAdapterResolver>("AuthAdapterResolver");
	public static readonly GuardResolverToken: Token<IGuardResolver> = new Token<IGuardResolver>("GuardResolver");
}
