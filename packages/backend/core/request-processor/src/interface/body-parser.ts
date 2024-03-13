import type { AnyObject, PossiblePromise } from "@/stacks/types";
import type { Request } from "@/backend-core/request-processor/handlers";

export interface IBodyParser {
	parse(request: Request): PossiblePromise<AnyObject>;
}
