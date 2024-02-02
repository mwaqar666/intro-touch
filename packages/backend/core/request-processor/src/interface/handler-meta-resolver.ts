import type { IResolvedRoute } from "@/backend-core/router/interface";
import type { Context } from "aws-lambda";
import type { IAppRequest } from "@/backend-core/request-processor/types";

export interface IHandlerMetaResolver {
	resolveHandlerMeta(request: IAppRequest, context: Context, resolvedRoute: IResolvedRoute): Promise<Array<unknown>>;
}
