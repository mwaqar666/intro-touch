import type { IError } from "@/backend-core/request-processor/types/response";

export interface IAppException extends IError {
	code: number;
}
