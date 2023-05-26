import type { IContainer } from "@/backend/core/contracts/container";
import type { IRouteHandler, IStackRouter } from "@/backend/router/interface";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { APIGatewayProxyResultV2, Context } from "aws-lambda";
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda/trigger/api-gateway-proxy";
import type { ApiRouteProps } from "sst/constructs";
import type { IntroTouch } from "@/backend/ignition/intro-touch";

export const main: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
	import("reflect-metadata");

	const { IntroTouch } = await import("@/backend/ignition/intro-touch");
	const introTouch: IntroTouch = IntroTouch.instance.bootstrapApplication();
	const container: IContainer = introTouch.application.getContainer();

	const { RouterTokenConst } = await import("@/backend/router/const");
	const routeHandler: IRouteHandler = container.resolve(RouterTokenConst.RouteHandlerToken);

	return routeHandler.handleRoute(event, context);
};

export const routeRegister = async (): Promise<Record<string, ApiRouteProps<AvailableAuthorizers>>> => {
	import("reflect-metadata");

	const { IntroTouch } = await import("@/backend/ignition/intro-touch");
	const introTouch: IntroTouch = IntroTouch.instance.bootstrapApplication();
	const container: IContainer = introTouch.application.getContainer();

	const { RouterTokenConst } = await import("@/backend/router/const");
	const stackRouter: IStackRouter = container.resolve(RouterTokenConst.StackRouterToken);

	return stackRouter.getApiStackRoutes();
};
