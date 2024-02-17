import type { ApiResponse } from "@/stacks/types";
import type { Request } from "@/backend-core/request-processor/handlers";

export interface IRequestProcessor {
	processRequest(): Promise<ApiResponse>;

	processRequest(request: Request): Promise<ApiResponse>;
}
