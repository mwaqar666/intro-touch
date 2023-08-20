import type { IAppRequest } from "@/backend-core/request-processor/types";
import type { Constructable } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IGuard } from "@/backend-core/authentication/interface/guard";

export interface IGuardResolver {
	runRouteGuards(request: IAppRequest, context: Context, guards: Array<Constructable<IGuard, Array<unknown>>>): Promise<void>;
}
