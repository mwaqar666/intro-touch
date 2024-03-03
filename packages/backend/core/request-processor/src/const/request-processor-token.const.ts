import { Token } from "iocc";
import type { IHandlerMetaResolver, IInterceptorResolver, IRequestProcessor } from "@/backend-core/request-processor/interface";

export class RequestProcessorTokenConst {
	public static readonly RequestProcessorToken: Token<IRequestProcessor> = new Token<IRequestProcessor>("RequestProcessor");
	public static readonly InterceptorResolverToken: Token<IInterceptorResolver> = new Token<IInterceptorResolver>("InterceptorResolver");
	public static readonly HandlerMetaResolverToken: Token<IHandlerMetaResolver> = new Token<IHandlerMetaResolver>("HandlerMetaResolver");
}
