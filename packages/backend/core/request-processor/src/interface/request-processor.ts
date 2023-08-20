import type { ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IAppRequest } from "@/backend-core/request-processor/types";

export interface IRequestProcessor {
	processRequest(): Promise<ApiResponse>;

	processRequest(request: IAppRequest, context: Context): Promise<ApiResponse>;
}
