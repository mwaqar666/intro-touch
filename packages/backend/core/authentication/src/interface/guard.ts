import type { Request } from "@/backend-core/request-processor/handlers";
import type { Constructable, PossiblePromise } from "@/stacks/types";

export interface IGuard<TRequest extends Request = Request> {
	guard(request: TRequest): PossiblePromise<void>;
}

export interface IGuardResolver {
	runRouteGuards(request: Request, guards: Array<Constructable<IGuard>>): Promise<void>;
}
