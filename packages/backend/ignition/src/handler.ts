import type { IContainer } from "@/backend/core/contracts/container";
import { RouterTokenConst } from "@/backend/router/const";
import type { IStackRouter } from "@/backend/router/interface";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { ApiRouteProps } from "sst/constructs";
import { IntroTouch } from "@/backend/ignition/intro-touch";

import("reflect-metadata");

export const index = (): Record<string, ApiRouteProps<AvailableAuthorizers>> => {
	const ignition: IntroTouch = IntroTouch.getInstance().bootstrapApplication();
	const container: IContainer = ignition.serviceContainer();

	console.log.call(null, container);

	return {};
};

export const routeRegister = (): Record<string, ApiRouteProps<AvailableAuthorizers>> => {
	const ignition: IntroTouch = IntroTouch.getInstance().bootstrapApplication();
	const container: IContainer = ignition.serviceContainer();

	const stackRouter: IStackRouter = container.get(RouterTokenConst.StackRouterToken);

	return stackRouter.getApiStackRoutes();
};
