import type { IResolvedRoute } from "@/backend-core/router/interface";
import type { Context } from "aws-lambda";
import type { IControllerRequest } from "@/backend-core/request-processor/types";

export interface IHandlerMetaResolver {
	resolveHandlerMeta(request: IControllerRequest, context: Context, resolvedRoute: IResolvedRoute): Promise<Array<any>>;
}
