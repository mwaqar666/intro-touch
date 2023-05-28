import type { Context } from "aws-lambda";
import { Inject } from "typedi";
import { RouterTokenConst } from "@/backend/router/const";
import type { IRequest, IResponse, IRouteHandler, IRouteRegister, ISimpleRoute } from "@/backend/router/interface";

export class RouteHandlerService implements IRouteHandler {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
	) {}

	public async handleRoute(request: IRequest, context: Context): Promise<IResponse> {
		const matchedRoute: ISimpleRoute = this.routeRegister.resolveRoute(request.rawPath);

		return matchedRoute.handler(request, context);
	}
}
