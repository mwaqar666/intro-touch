import type { StackContext } from "sst/constructs";
import { Auth, Function, use } from "sst/constructs";
import { Config } from "@/stacks/config";
import { AuthConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IDatabaseStack } from "@/stacks/stacks/DatabaseStack";
import { DatabaseStack } from "@/stacks/stacks/DatabaseStack";

export interface IAuthStack {
	auth: Auth;
	lambdaEnvironment: Record<string, string>;
}

export const AuthStack = ({ app, stack }: StackContext): IAuthStack => {
	const { database, databaseName, databaseSecret }: IDatabaseStack = use(DatabaseStack);

	const appVersion: string = Config.get("APP_VERSION");
	const googleClientId: string = Config.get("GOOGLE_CLIENT_ID");
	const googleRedirectUrl: string = Config.get("GOOGLE_REDIRECT_URL");
	const dbMigrationPass: string = Config.get("DB_MIGRATION_PASS");

	const lambdaEnvironment: Record<string, string> = {
		NODE_ENV: app.stage,
		APP_NAME: app.name,
		APP_VERSION: appVersion,
		DB_NAME: databaseName,
		DB_HOST: database.clusterEndpoint.hostname,
		DB_PORT: database.clusterEndpoint.port.toString(),
		DB_USER: databaseSecret.secretValueFromJson("username").toString(),
		DB_PASS: databaseSecret.secretValueFromJson("password").toString(),
		DB_MIGRATION_PASS: dbMigrationPass,
		GOOGLE_CLIENT_ID: googleClientId,
		GOOGLE_REDIRECT_URL: googleRedirectUrl,
	};

	const apiAuthHandlerLambda = new Function(stack, AuthConst.ApiAuthHandlerLambdaId(app.stage), {
		timeout: "30 seconds",
		runtime: "nodejs18.x",
		architecture: "arm_64",
		handler: "packages/backend/core/ignition/src/handlers/auth-invoker-handler.authInvokerHandler",
		environment: lambdaEnvironment,
		nodejs: {
			install: ["pg", "pg-hstore"],
			esbuild: {
				plugins: [esBuildDecoratorPlugin],
			},
		},
	});

	const auth: Auth = new Auth(stack, AuthConst.ApiAuthId(app.stage), {
		authenticator: apiAuthHandlerLambda,
	});

	stack.addOutputs({
		awsProfile: app.account,
		authId: auth.id,
	});

	return {
		auth,
		lambdaEnvironment,
	};
};
