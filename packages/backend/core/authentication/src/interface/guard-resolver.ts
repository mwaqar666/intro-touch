import type { Request } from "@/backend-core/request-processor/handlers";
import type { Constructable } from "@/stacks/types";
import type { IGuard } from "@/backend-core/authentication/interface/guard";

export interface IGuardResolver {
	runRouteGuards(request: Request, guards: Array<Constructable<IGuard, Array<unknown>>>): Promise<void>;
}
