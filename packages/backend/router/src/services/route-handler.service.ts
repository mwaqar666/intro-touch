import type { Optional } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { RouterTokenConst } from "@/backend/router/const";
import type { RouteMethod } from "@/backend/router/enum";
import type { IRequest, IResponse, IRouteHandler, IRouteRegister, ISimpleRoute } from "@/backend/router/interface";

export class RouteHandlerService implements IRouteHandler {
	private request: IRequest;
	private context: Context;

	public constructor(
		// Dependencies
		@Inject(RouterTokenConst.RouteRegisterToken) private readonly routeRegister: IRouteRegister,
	) {}

	public async handleRoute(request: IRequest, context: Context): Promise<IResponse> {
		this.cacheRequestAndContextObjects(request, context);

		const { path, method } = this.request.requestContext.http;

		const preFlightResponse: Optional<IResponse> = this.checkForPreFlightRequest(method);
		if (preFlightResponse) return preFlightResponse;

		const matchedRoute: ISimpleRoute = this.routeRegister.resolveRoute(path, <RouteMethod>method);

		return matchedRoute.handler(this.request, this.context);
	}

	public resolveRouteParams(route: ISimpleRoute): void {}

	private cacheRequestAndContextObjects(request: IRequest, context: Context): void {
		this.request = request;
		this.context = context;
	}

	private checkForPreFlightRequest(method: string): Optional<IResponse> {
		const isPreflightRequest: boolean = method === "OPTIONS";

		if (!isPreflightRequest) return;

		return { statusCode: 200 };
	}
}
