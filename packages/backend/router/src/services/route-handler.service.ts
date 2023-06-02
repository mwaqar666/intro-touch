import type { Context } from "aws-lambda";
import { Inject } from "ioc-class";
import { RouterTokenConst } from "@/backend/router/const";
import type { RouteMethod } from "@/backend/router/enum";
import type { IRequest, IResponse, IRouteHandler, IRouteRegister, ISimpleRoute } from "@/backend/router/interface";

export class RouteHandlerService implements IRouteHandler {
	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
	) {}

	public async handleRoute(request: IRequest, context: Context): Promise<IResponse> {
		const { path, method } = request.requestContext.http;

		const isPreflightRequest: boolean = method === "OPTIONS";
		if (isPreflightRequest) return { statusCode: 200 };

		const matchedRoute: ISimpleRoute = this.routeRegister.resolveRoute(path, <RouteMethod>method);

		return matchedRoute.handler(request, context);
	}
}
