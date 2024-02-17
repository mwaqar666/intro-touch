import type { Request } from "@/backend-core/request-processor/handlers";
import type { PossiblePromise } from "@/stacks/types";

export interface IGuard<TRequest extends Request = Request> {
	guard(request: TRequest): PossiblePromise<void>;
}
