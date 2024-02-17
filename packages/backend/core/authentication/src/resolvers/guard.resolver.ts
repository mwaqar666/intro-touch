import { App } from "@/backend-core/core/extensions";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { Constructable } from "@/stacks/types";
import type { IGuard, IGuardResolver } from "@/backend-core/authentication/interface";

export class GuardResolver implements IGuardResolver {
	public async runRouteGuards(request: Request, guards: Array<Constructable<IGuard, Array<unknown>>>): Promise<void> {
		for (const guard of guards) {
			const resolvedGuard: IGuard = App.container.resolve(guard);

			await resolvedGuard.guard(request);
		}
	}
}
