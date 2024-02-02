import type { HttpStatusCode } from "@/backend-core/request-processor/enums";
import type { IErrorResponseBody } from "@/backend-core/request-processor/types/response";

export interface IAppException extends IErrorResponseBody {
	code: HttpStatusCode;
}
