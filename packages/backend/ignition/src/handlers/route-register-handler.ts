import type { IStackRouter } from "@/backend/router/interface";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { IContainer } from "ioc-class";
import type { ApiRouteProps } from "sst/constructs";
import type { IntroTouch } from "@/backend/ignition/main";

export const routeRegisterHandler = async (): Promise<Record<string, ApiRouteProps<AvailableAuthorizers>>> => {
	await import("reflect-metadata");

	const { IntroTouch } = await import("@/backend/ignition/main/intro-touch");
	const introTouch: IntroTouch = new IntroTouch();
	await introTouch.bootstrapApplication();
	const container: IContainer = introTouch.application.getContainer();

	const { RouterTokenConst } = await import("@/backend/router/const");
	const stackRouter: IStackRouter = container.resolve(RouterTokenConst.StackRouterToken);

	return stackRouter.getApiStackRoutes();
};
