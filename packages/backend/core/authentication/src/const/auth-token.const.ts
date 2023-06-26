import type { UserEntity } from "@/backend/user/db/entities";
import type { IRequestInterceptor } from "@/backend-core/request-processor/interface";
import type { IControllerAuthRequest } from "@/backend-core/request-processor/types";
import { Token } from "iocc";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import type { AuthRequestService } from "@/backend-core/authentication/services";
import type { IGoogleAdapter } from "@/backend-core/authentication/types";

export class AuthTokenConst {
	public static readonly GoogleAdapterToken: Token<IAuthAdapter<IGoogleAdapter>> = new Token<IAuthAdapter<IGoogleAdapter>>("GoogleAdapter");
	public static readonly AuthAdapterResolverToken: Token<IAuthAdapterResolver> = new Token<IAuthAdapterResolver>("AuthAdapterResolver");

	public static readonly AuthRequestServiceToken: Token<AuthRequestService> = new Token<AuthRequestService>("AuthRequestService");
	public static readonly AuthRequestInterceptorToken: Token<IRequestInterceptor<IControllerAuthRequest<UserEntity>>> = new Token<IRequestInterceptor<IControllerAuthRequest<UserEntity>>>("AuthRequestInterceptor");
}
