import("reflect-metadata");

import type { IRequest, IResponse, IRouteHandler } from "@/backend/router/interface";
import type { Context } from "aws-lambda";
import type { IContainer } from "iocc";
import type { IntroTouch } from "@/backend/ignition/main";

export const index = async (event: IRequest, context: Context): Promise<IResponse> => {
	const { IntroTouch } = await import("@/backend/ignition/main");
	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();

	return await introTouch.runApplication(async (container: IContainer): Promise<IResponse> => {
		const { RouterTokenConst } = await import("@/backend/router/const");
		const routeHandler: IRouteHandler = container.resolve(RouterTokenConst.RouteHandlerToken);

		return routeHandler.handleRoute(event, context);
	});
};
