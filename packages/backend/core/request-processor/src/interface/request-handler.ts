import type { IPathParams, IQueryParams, IResolvedRoute } from "@/backend-core/router/interface";
import type { Context } from "aws-lambda";
import type { IAppRequest } from "@/backend-core/request-processor/types";

export interface IRequestHandler {
	getRequest<T = object, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams>(): IAppRequest<T, P, Q>;

	getRoute<P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams>(): IResolvedRoute<P, Q>;

	getContext(): Context;
}
