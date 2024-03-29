import type { FunctionProps, StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import type { ApiFunctionRouteProps, ApiProps } from "sst/constructs/Api";
import { routeRegisterHandler } from "@/backend-core/ignition/handlers/route-register-handler";
import type { IStackRoute } from "@/backend-core/router/interface";
import { Config } from "@/stacks/config";
import { ApiConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IDatabaseStack } from "@/stacks/stacks/DatabaseStack";
import { DatabaseStack } from "@/stacks/stacks/DatabaseStack";
import type { IEmailStack } from "@/stacks/stacks/EmailStack";
import { EmailStack } from "@/stacks/stacks/EmailStack";

export interface IApiStack {
	api: Api;
	defaultFunctionProps: FunctionProps;
}

export const ApiStack = async ({ app, stack }: StackContext): Promise<IApiStack> => {
	const { emailFrom }: IEmailStack = use(EmailStack);
	const { databaseName, databaseHost, databasePort, databaseUser, databasePass, databaseToken }: IDatabaseStack = use(DatabaseStack);

	const domainName: string = Config.get("APP_DOMAIN");
	const appVersion: string = Config.get("APP_VERSION");
	const appKey: string = Config.get("APP_KEY");
	const storageDriver: string = Config.get("STORAGE_DRIVER");
	const googleClientId: string = Config.get("GOOGLE_CLIENT_ID");
	const facebookClientId: string = Config.get("FACEBOOK_CLIENT_ID");
	const facebookClientSecret: string = Config.get("FACEBOOK_CLIENT_SECRET");
	const authRedirectUrl: string = Config.get("REDIRECT_URL");
	const tokenExpiry: string = Config.get("TOKEN_EXPIRY");
	const frontEndUrl: string = Config.get("FRONTEND_URL");

	const defaultFunctionProps: FunctionProps = {
		timeout: "30 seconds",
		runtime: "nodejs20.x",
		architecture: "arm_64",
		environment: {
			NODE_ENV: app.stage,
			APP_NAME: app.name,
			APP_VERSION: appVersion,
			APP_REGION: app.region,
			APP_KEY: appKey,
			DB_NAME: databaseName,
			DB_HOST: databaseHost,
			DB_PORT: databasePort,
			DB_USER: databaseUser,
			DB_PASS: databasePass,
			DB_TOKEN: databaseToken,
			STORAGE_DRIVER: storageDriver,
			FRONTEND_URL: frontEndUrl,
			GOOGLE_CLIENT_ID: googleClientId,
			FACEBOOK_CLIENT_ID: facebookClientId,
			FACEBOOK_CLIENT_SECRET: facebookClientSecret,
			REDIRECT_URL: authRedirectUrl,
			TOKEN_EXPIRY: tokenExpiry,
			EMAIL_FROM: emailFrom,
		},
		nodejs: {
			install: ["pg-hstore"],
			esbuild: {
				plugins: [esBuildDecoratorPlugin],
			},
		},
	};

	const stackRoutes: Array<IStackRoute> = await routeRegisterHandler();

	const apiRouteProps: ApiProps = {
		cors: {
			allowOrigins: ["*"], // Adjust according to your security requirements
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Add any other methods your API uses
			allowHeaders: ["Content-Type", "Authorization"], // Include any custom headers your client might send
			maxAge: "1 day", // Optional: Define the max age for the preflight request cache
		},
		routes: Object.fromEntries(
			stackRoutes.map((stackRoute: IStackRoute): [string, ApiFunctionRouteProps] => {
				const methodAndPath = `${stackRoute.method} ${stackRoute.path}`;
				const routeHandler: ApiFunctionRouteProps = {
					function: {
						...defaultFunctionProps,
						handler: "packages/backend/core/ignition/src/handlers/route-invoker-handler.routeInvokerHandler",
					},
				};

				return [methodAndPath, routeHandler];
			}),
		),
	};

	if (domainName) apiRouteProps.customDomain = { domainName };

	const api: Api = new Api(stack, ApiConst.ApiId(app.stage), apiRouteProps);

	api.attachPermissions(["ses:*", "s3:*"]);

	stack.addOutputs({
		nodeEnvironment: app.stage,
		appName: app.name,
		appVersion,
		apiUrl: api.url,
		apiCustomDomainUrl: api.customDomainUrl,
		apiArn: api.httpApiArn,
	});

	return {
		api,
		defaultFunctionProps,
	};
};
