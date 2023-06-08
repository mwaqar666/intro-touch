import type { ApiRequest, ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";

export interface IRequestProcessor {
	processRequest(apiRequest: ApiRequest, context: Context): Promise<ApiResponse>;
}
