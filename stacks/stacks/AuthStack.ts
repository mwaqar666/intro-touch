import type { FunctionProps, StackContext } from "sst/constructs";
import { Auth, use } from "sst/constructs";
import { Config } from "@/stacks/config";
import { AuthConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IDatabaseStack } from "@/stacks/stacks/DatabaseStack";
import { DatabaseStack } from "@/stacks/stacks/DatabaseStack";

export interface IAuthStack {
	auth: Auth;
	defaultFunctionProps: FunctionProps;
	lambdaEnvironment: Record<string, string>;
}

export const AuthStack = ({ app, stack }: StackContext): IAuthStack => {
	const { databaseName, databaseHost, databasePort, databaseUser, databasePass, databaseMigrationPass }: IDatabaseStack = use(DatabaseStack);

	const appVersion: string = Config.get("APP_VERSION");
	const appKey: string = Config.get("APP_KEY");
	const googleClientId: string = Config.get("GOOGLE_CLIENT_ID");
	const authRedirectUrl: string = Config.get("REDIRECT_URL");
	const tokenExpiry: string = Config.get("TOKEN_EXPIRY");

	const lambdaEnvironment: Record<string, string> = {
		NODE_ENV: app.stage,
		APP_NAME: app.name,
		APP_VERSION: appVersion,
		APP_KEY: appKey,
		DB_NAME: databaseName,
		DB_HOST: databaseHost,
		DB_PORT: databasePort,
		DB_USER: databaseUser,
		DB_PASS: databasePass,
		DB_MIGRATION_PASS: databaseMigrationPass,
		GOOGLE_CLIENT_ID: googleClientId,
		REDIRECT_URL: authRedirectUrl,
		TOKEN_EXPIRY: tokenExpiry,
		SST_Auth_privateKey_auth: "__FETCH_FROM_SSM__",
	};

	const defaultFunctionProps: FunctionProps = {
		timeout: "30 seconds",
		runtime: "nodejs18.x",
		architecture: "arm_64",
		permissions: ["ssm"],
		nodejs: {
			install: ["pg", "pg-hstore"],
			esbuild: {
				plugins: [esBuildDecoratorPlugin],
			},
		},
	};

	const auth: Auth = new Auth(stack, AuthConst.ApiAuthId(app.stage), {
		authenticator: {
			...defaultFunctionProps,
			environment: lambdaEnvironment,
			handler: "packages/backend/core/ignition/src/handlers/auth-invoker-handler.authInvokerHandler",
		},
	});

	stack.addOutputs({
		awsProfile: app.account,
		authId: auth.id,
	});

	return {
		auth,
		lambdaEnvironment,
		defaultFunctionProps,
	};
};
