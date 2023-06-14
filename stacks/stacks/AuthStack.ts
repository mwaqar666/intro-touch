import type { StackContext } from "sst/constructs";
import { Auth, Function, use } from "sst/constructs";
import { Config } from "@/stacks/config";
import { AuthConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IDatabaseStack } from "@/stacks/stacks/DatabaseStack";
import { DatabaseStack } from "@/stacks/stacks/DatabaseStack";

export interface IAuthStack {
	auth: Auth;
	awsProfile: string;
}

export const AuthStack = ({ app, stack }: StackContext): IAuthStack => {
	const { database, databaseName, databaseSecret }: IDatabaseStack = use(DatabaseStack);

	const appVersion: string = Config.get("APP_VERSION");

	const apiAuthHandlerLambda = new Function(stack, AuthConst.API_AUTH_HANDLER_LAMBDA_ID, {
		timeout: "30 seconds",
		runtime: "nodejs18.x",
		architecture: "arm_64",
		handler: "packages/backend/core/ignition/src/handlers/auth-invoker-handler.authInvokerHandler",
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

	const auth: Auth = new Auth(stack, AuthConst.API_AUTH_ID, {
		authenticator: apiAuthHandlerLambda,
	});

	stack.addOutputs({
		awsProfile: app.account,
		authId: auth.id,
	});

	return {
		auth,
		awsProfile: app.account,
	};
};
