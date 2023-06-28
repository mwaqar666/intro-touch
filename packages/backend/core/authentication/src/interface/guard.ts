import type { IControllerRequest } from "@/backend-core/request-processor/types";
import type { PossiblePromise } from "@/stacks/types";
import type { Context } from "aws-lambda";

export interface IGuard<T extends IControllerRequest = IControllerRequest> {
	guard(request: T, context: Context): PossiblePromise<void>;
}
