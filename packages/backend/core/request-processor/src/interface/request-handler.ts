import type { Context } from "aws-lambda";
import type { IAppRequest } from "@/backend-core/request-processor/types";

export interface IRequestHandler {
	getRequest(): IAppRequest;

	getContext(): Context;
}
