import("reflect-metadata");

import type { IStackRouter } from "@/backend/router/interface";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { ApiRouteProps } from "sst/constructs";
import type { IntroTouch } from "@/backend/ignition/main";

export const routeRegisterHandler = async (): Promise<Record<string, ApiRouteProps<AvailableAuthorizers>>> => {
	const { IntroTouch } = await import("@/backend/ignition/main");
	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();
	const container = introTouch.getApplication().getApplicationContainer();

	const { RouterTokenConst } = await import("@/backend/router/const");
	const stackRouter: IStackRouter = container.resolve(RouterTokenConst.StackRouterToken);

	return stackRouter.getApiStackRoutes();
};
