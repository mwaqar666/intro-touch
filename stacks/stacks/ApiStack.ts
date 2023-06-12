import type { StackContext } from "sst/constructs";
import { Api, Function, use } from "sst/constructs";
import type { ApiFunctionRouteProps } from "sst/constructs/Api";
import { routeRegisterHandler } from "@/backend-core/ignition/handlers/route-register-handler";
import type { IStackRoute } from "@/backend-core/router/interface";
import { Config } from "@/stacks/config";
import { ApiConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IAuthStack } from "@/stacks/stacks/AuthStack";
import { AuthStack } from "@/stacks/stacks/AuthStack";
import type { IDatabaseStack } from "@/stacks/stacks/DatabaseStack";
import { DatabaseStack } from "@/stacks/stacks/DatabaseStack";
import type { AuthorizedApi, AvailableAuthorizers } from "@/stacks/types";

export interface IApiStack {
	api: Api<AuthorizedApi>;
}

export const ApiStack = async ({ app, stack }: StackContext): Promise<IApiStack> => {
	const { auth }: IAuthStack = use(AuthStack);
	const { database, databaseName, databaseSecret }: IDatabaseStack = use(DatabaseStack);

	const appVersion: string = Config.get("APP_VERSION");

	const apiGatewayHandlerLambda = new Function(stack, ApiConst.API_GATEWAY_LAMBDA_ID, {
		runtime: "nodejs18.x",
		architecture: "arm_64",
		handler: "packages/backend/core/ignition/src/handlers/route-invoker-handler.routeInvokerHandler",
		environment: {
			NODE_ENV: app.stage,
			APP_NAME: app.name,
			APP_VERSION: appVersion,
			DB_NAME: databaseName,
			DB_HOST: database.clusterEndpoint.hostname,
			DB_PORT: database.clusterEndpoint.port.toString(),
			DB_USER: databaseSecret.secretValueFromJson("username").toString(),
			DB_PASS: databaseSecret.secretValueFromJson("password").toString(),
		},
		nodejs: {
			install: ["pg", "pg-hstore"],
			esbuild: {
				plugins: [esBuildDecoratorPlugin],
			},
		},
	});

	databaseSecret.grantRead(apiGatewayHandlerLambda);

	const stackRoutes: Array<IStackRoute> = await routeRegisterHandler();

	const api: Api<AuthorizedApi> = new Api<AuthorizedApi>(stack, ApiConst.API_ID, {
		authorizers: {
			jwt: {
				type: "user_pool",
				userPool: {
					id: auth.userPoolId,
					clientIds: [auth.userPoolClientId],
				},
			},
		},
		routes: Object.fromEntries(
			stackRoutes.map((stackRoute: IStackRoute): [string, ApiFunctionRouteProps<AvailableAuthorizers>] => {
				const methodAndPath = `${stackRoute.method} ${stackRoute.path}`;
				const routeHandler: ApiFunctionRouteProps<AvailableAuthorizers> = {
					type: "function",
					authorizer: stackRoute.authorizer,
					cdk: {
						function: apiGatewayHandlerLambda,
					},
				};

				return [methodAndPath, routeHandler];
			}),
		),
	});

	auth.attachPermissionsForAuthUsers(stack, [api]);

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
