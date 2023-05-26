import type { IApplication } from "@/backend/core/contracts/application";
import type { IContainer } from "@/backend/core/contracts/container";
import type { IRouteHandler, IStackRouter } from "@/backend/router/interface";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2, Context } from "aws-lambda";
import type { ApiRouteProps } from "sst/constructs";

const loadApplication = async (): Promise<IApplication> => {
	import("reflect-metadata");

	const { IntroTouch } = await import("@/backend/ignition/intro-touch");
	return IntroTouch.instance.bootstrapApplication().application;
};

export const main: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
	const application: IApplication = await loadApplication();
	const container: IContainer = application.getContainer();

	const { RouterTokenConst } = await import("@/backend/router/const");
	const routeHandler: IRouteHandler = container.resolve(RouterTokenConst.RouteHandlerToken);

	return routeHandler.handleRoute(event, context);
};

export const routeRegister = async (): Promise<Record<string, ApiRouteProps<AvailableAuthorizers>>> => {
	const application: IApplication = await loadApplication();
	const container: IContainer = application.getContainer();

	const { RouterTokenConst } = await import("@/backend/router/const");
	const stackRouter: IStackRouter = container.resolve(RouterTokenConst.StackRouterToken);

	return stackRouter.getApiStackRoutes();
};
