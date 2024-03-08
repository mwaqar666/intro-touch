import type { Request } from "@/backend-core/request-processor/handlers";

export interface IBodyParser<T extends object = object> {
	parse(request: Request<T>): T;
}
