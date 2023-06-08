import { Token } from "iocc";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";

export class RequestProcessorTokenConst {
	public static readonly RequestProcessor: Token<IRequestProcessor> = new Token<IRequestProcessor>("RequestProcessor");
}
