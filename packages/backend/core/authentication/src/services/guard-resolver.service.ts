import { AppContainer } from "@/backend-core/core/extensions";
import type { IControllerRequest } from "@/backend-core/request-processor/types";
import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IGuard, IGuardResolver } from "@/backend-core/authentication/interface";

export class GuardResolverService implements IGuardResolver {
	public async runRouteGuards(request: IControllerRequest, context: Context, guards: Array<Constructable<IGuard, Array<unknown>>>): Promise<void> {
		for (const guard of guards) {
			const resolvedGuard: IGuard = AppContainer.resolve(guard);

			await resolvedGuard.guard(request, context);
		}
	}
}