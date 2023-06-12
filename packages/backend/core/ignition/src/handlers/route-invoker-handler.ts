import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiRequest, ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IContainer } from "iocc";
import type { IntroTouch } from "@/backend-core/ignition/main";

export const routeInvokerHandler = async (event: ApiRequest, context: Context): Promise<ApiResponse> => {
	await import("reflect-metadata");

	const { IntroTouch } = await import("@/backend-core/ignition/main");
	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();

	return await introTouch.hotExecuteWithinApplicationContext(async (container: IContainer): Promise<ApiResponse> => {
		const { RequestProcessorTokenConst } = await import("@/backend-core/request-processor/const");
		const requestProcessor: IRequestProcessor = container.resolve(RequestProcessorTokenConst.RequestProcessor);

		return await requestProcessor.processRequest(event, context);
	});
};
