import type { IError } from "@/backend-core/request-processor/types";

export interface IValidationError extends IError {
	context: Record<string, string>;
}
