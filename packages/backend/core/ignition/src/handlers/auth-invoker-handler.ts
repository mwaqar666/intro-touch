import type { IAuthAdapterResolver } from "@/backend-core/auth/interface";
import type { ApiRequest, ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IContainer } from "iocc";
import type { IntroTouch } from "@/backend-core/ignition/main";

export const authInvokerHandler = async (request: ApiRequest, context: Context): Promise<ApiResponse> => {
	await import("reflect-metadata");
	const { AuthHandler } = await import("sst/node/auth");
	const { IntroTouch } = await import("@/backend-core/ignition/main");
	const { AuthTokenConst } = await import("@/backend-core/auth/const");

	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();

	return await introTouch.hotExecuteWithinApplicationContext(async (container: IContainer): Promise<ApiResponse> => {
		const authAdapterResolver: IAuthAdapterResolver = container.resolve(AuthTokenConst.AuthAdapterResolverToken);

		const authHandler = AuthHandler({
			providers: authAdapterResolver.resolveAdapters(),
		});

		return await authHandler(request, context);
	});
};
