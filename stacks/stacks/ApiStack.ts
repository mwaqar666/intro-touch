import type { StackContext } from "sst/constructs";
import { Api, Function, use } from "sst/constructs";
import type { ApiFunctionRouteProps, ApiProps } from "sst/constructs/Api";
import { routeRegisterHandler } from "@/backend-core/ignition/handlers/route-register-handler";
import type { IStackRoute } from "@/backend-core/router/interface";
import { Config } from "@/stacks/config";
import { ApiConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IAuthStack } from "@/stacks/stacks/AuthStack";
import { AuthStack } from "@/stacks/stacks/AuthStack";
import type { AvailableAuthorizers } from "@/stacks/types";

export interface IApiStack {
	api: Api;
}

export const ApiStack = async ({ app, stack }: StackContext): Promise<IApiStack> => {
	const { auth, lambdaEnvironment }: IAuthStack = use(AuthStack);

	const domainName: string = Config.get("APP_DOMAIN");
	const appVersion: string = Config.get("APP_VERSION");

	const apiGatewayHandlerLambda = new Function(stack, ApiConst.ApiGatewayLambdaId(app.stage), {
		timeout: "30 seconds",
		runtime: "nodejs18.x",
		architecture: "arm_64",
		handler: "packages/backend/core/ignition/src/handlers/route-invoker-handler.routeInvokerHandler",
		environment: lambdaEnvironment,
		nodejs: {
			install: ["pg", "pg-hstore"],
			esbuild: {
				plugins: [esBuildDecoratorPlugin],
			},
		},
	});

	const stackRoutes: Array<IStackRoute> = await routeRegisterHandler();

	const apiRouteProps: ApiProps = {
		routes: Object.fromEntries(
			stackRoutes.map((stackRoute: IStackRoute): [string, ApiFunctionRouteProps<AvailableAuthorizers>] => {
				const methodAndPath = `${stackRoute.method} ${stackRoute.path}`;
				const routeHandler: ApiFunctionRouteProps<AvailableAuthorizers> = {
					type: "function",
					authorizer: "none",
					cdk: {
						function: apiGatewayHandlerLambda,
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
