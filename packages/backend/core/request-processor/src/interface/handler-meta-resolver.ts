import type { IResolvedRoute } from "@/backend-core/router/interface";
import type { Request } from "@/backend-core/request-processor/handlers";

export interface IHandlerMetaResolver {
	resolveHandlerMeta(request: Request, resolvedRoute: IResolvedRoute): Promise<Array<unknown>>;
}
