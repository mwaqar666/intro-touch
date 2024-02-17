import type { ApiRequest, DeepReadonly } from "@/stacks/types";
import type { IPathParams, IQueryParams, IResolvedRoute } from "@/backend-core/router/interface/route";

export interface IRouteResolver<P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> {
	resolveRoute(): IResolvedRoute<P, Q>;

	resolveRoute(rawRequest: DeepReadonly<ApiRequest>): IResolvedRoute<P, Q>;
}
