import type { IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import type { ApiRequest, ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import type { IContainer } from "iocc";
import type { IntroTouch } from "@/backend-core/ignition/main";

export const authInvokerHandler = async (request: ApiRequest, context: Context): Promise<ApiResponse> => {
	await import("reflect-metadata");

	const { AuthHandler } = await import("sst/node/auth");
	const { IntroTouch } = await import("@/backend-core/ignition/main/intro-touch");
	const { AuthenticationTokenConst } = await import("@/backend-core/authentication/const");

	const introTouch: IntroTouch = await IntroTouch.getInstance().bootstrapApplication();

	return introTouch.hotExecuteWithinApplicationContext(async (container: IContainer): Promise<ApiResponse> => {
		const authAdapterResolver: IAuthAdapterResolver = container.resolve(AuthenticationTokenConst.AuthAdapterResolverToken);

		const authHandler = AuthHandler({
			providers: authAdapterResolver.resolveAdapters(),
		});

		return authHandler(request, context);
	});
};
