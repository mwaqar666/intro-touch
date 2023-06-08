import type { IStackRouter } from "@/backend-core/router/interface";
import type { AvailableAuthorizers } from "@/stacks/types";
import type { IContainer } from "iocc";
import type { ApiRouteProps } from "sst/constructs";
import type { IntroTouch } from "@/backend-core/ignition/main";

export const routeRegisterHandler = async (): Promise<Record<string, ApiRouteProps<AvailableAuthorizers>>> => {
	await import("reflect-metadata");

	const { IntroTouch } = await import("@/backend-core/ignition/main");
	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();

	return await introTouch.runInApplicationContextWithoutModuleRunHook(async (container: IContainer): Promise<Record<string, ApiRouteProps<AvailableAuthorizers>>> => {
		const { RouterTokenConst } = await import("@/backend-core/router/const");
		const stackRouter: IStackRouter = container.resolve(RouterTokenConst.StackRouterToken);

		return stackRouter.getApiStackRoutes();
	});
};
