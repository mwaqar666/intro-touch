import type { IStackRoute, IStackRouter } from "@/backend-core/router/interface";
import type { IContainer } from "iocc";
import type { IntroTouch } from "@/backend-core/ignition/main";

export const routeRegisterHandler = async (): Promise<Array<IStackRoute>> => {
	await import("reflect-metadata");

	const { IntroTouch } = await import("@/backend-core/ignition/main/intro-touch");
	const { RouterTokenConst } = await import("@/backend-core/router/const");

	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();

	return await introTouch.coldExecuteWithinApplicationContext(async (container: IContainer): Promise<Array<IStackRoute>> => {
		const stackRouter: IStackRouter = container.resolve(RouterTokenConst.StackRouterToken);

		return stackRouter.getApiStackRoutes();
	});
};
