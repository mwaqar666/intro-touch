import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiRequest, ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IContainer } from "iocc";
import type { IntroTouch } from "@/backend-core/ignition/main";

export const routeInvokerHandler = async (request: ApiRequest, context: Context): Promise<ApiResponse> => {
	await import("reflect-metadata");

	const { ApiHandler } = await import("sst/node/api");
	const { IntroTouch } = await import("../main/intro-touch");
	const { RequestProcessorTokenConst } = await import("@/backend-core/request-processor/const");

	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();

	return introTouch.hotExecuteWithinApplicationContext(async (container: IContainer): Promise<ApiResponse> => {
		const requestProcessor: IRequestProcessor = container.resolve(RequestProcessorTokenConst.RequestProcessorToken);

		const apiHandler = ApiHandler(async (request: ApiRequest, context: Context): Promise<ApiResponse> => {
			return requestProcessor.processRequest(request, context);
		});

		return apiHandler(request, context);
	});
};
