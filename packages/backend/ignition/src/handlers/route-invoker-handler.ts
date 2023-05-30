import type { IRequest, IResponse, IRouteHandler } from "@/backend/router/interface";
import type { Context } from "aws-lambda";
import type { IntroTouch } from "@/backend/ignition/main";

export const routeInvokerHandler = async (event: IRequest, context: Context): Promise<IResponse> => {
	await import("reflect-metadata");

	const { IntroTouch } = await import("@/backend/ignition/main/intro-touch");
	const introTouch: IntroTouch = new IntroTouch();
	await introTouch.bootstrapApplication();
	const container = introTouch.application.getContainer();

	const { RouterTokenConst } = await import("@/backend/router/const");
	const routeHandler: IRouteHandler = container.resolve(RouterTokenConst.RouteHandlerToken);

	return routeHandler.handleRoute(event, context);
};
