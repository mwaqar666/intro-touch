import { Token } from "iocc";
import type { IInterceptorResolver, IRequestProcessor, IResponseHandler } from "@/backend-core/request-processor/interface";

export class RequestProcessorTokenConst {
	public static readonly ResponseHandlerToken: Token<IResponseHandler> = new Token<IResponseHandler>("ResponseHandler");
	public static readonly RequestProcessorToken: Token<IRequestProcessor> = new Token<IRequestProcessor>("RequestProcessor");
	public static readonly InterceptorResolverToken: Token<IInterceptorResolver> = new Token<IInterceptorResolver>("InterceptorResolver");
}
