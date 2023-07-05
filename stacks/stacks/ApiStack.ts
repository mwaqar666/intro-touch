import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import type { ApiFunctionRouteProps, ApiProps } from "sst/constructs/Api";
import { routeRegisterHandler } from "@/backend-core/ignition/handlers/route-register-handler";
import type { IStackRoute } from "@/backend-core/router/interface";
import { Config } from "@/stacks/config";
import { ApiConst } from "@/stacks/const";
import type { IAuthStack } from "@/stacks/stacks/AuthStack";
import { AuthStack } from "@/stacks/stacks/AuthStack";

export interface IApiStack {
	api: Api;
}

export const ApiStack = async ({ app, stack }: StackContext): Promise<IApiStack> => {
	const { auth, lambdaEnvironment, defaultFunctionProps }: IAuthStack = use(AuthStack);

	const domainName: string = Config.get("APP_DOMAIN");
	const appVersion: string = Config.get("APP_VERSION");

	const stackRoutes: Array<IStackRoute> = await routeRegisterHandler();

	const apiRouteProps: ApiProps = {
		routes: Object.fromEntries(
			stackRoutes.map((stackRoute: IStackRoute): [string, ApiFunctionRouteProps] => {
				const methodAndPath = `${stackRoute.method} ${stackRoute.path}`;
				const routeHandler: ApiFunctionRouteProps = {
					function: {
						...defaultFunctionProps,
						environment: lambdaEnvironment,
						handler: "packages/backend/core/ignition/src/handlers/route-invoker-handler.routeInvokerHandler",
					},
				};

				return [methodAndPath, routeHandler];
			}),
		),
	};

	if (domainName) apiRouteProps.customDomain = { domainName };

	const api: Api = new Api(stack, ApiConst.ApiId(app.stage), apiRouteProps);

	auth.attach(stack, {
		api,
		prefix: "/auth",
	});

	stack.addOutputs({
		nodeEnvironment: app.stage,
		appName: app.name,
		appVersion: appVersion,
		apiUrl: api.url,
		apiCustomDomainUrl: api.customDomainUrl,
		apiArn: api.httpApiArn,
	});

	return {
		api,
	};
};
