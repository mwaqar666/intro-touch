import { Token } from "iocc";
import type { IRequestProcessor, IResponseHandler } from "@/backend-core/request-processor/interface";

export class RequestProcessorTokenConst {
	public static readonly ResponseHandler: Token<IResponseHandler> = new Token<IResponseHandler>("ResponseHandler");
	public static readonly RequestProcessor: Token<IRequestProcessor> = new Token<IRequestProcessor>("RequestProcessor");
}
