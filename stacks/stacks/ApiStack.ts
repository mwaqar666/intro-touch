import type { ApiProps, StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { routeRegisterHandler } from "@/backend-core/ignition/handlers/route-register-handler";
import { Config } from "@/stacks/config";
import { ApiConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IAuthStack } from "@/stacks/stacks/AuthStack";
import { AuthStack } from "@/stacks/stacks/AuthStack";
import type { IDatabaseStack } from "@/stacks/stacks/DatabaseStack";
import { DatabaseStack } from "@/stacks/stacks/DatabaseStack";
import type { AuthorizedApi } from "@/stacks/types";

export interface IApiStack {
	api: Api<AuthorizedApi>;
}

export const ApiStack = async ({ app, stack }: StackContext): Promise<IApiStack> => {
	const { database, databaseUser }: IDatabaseStack = use(DatabaseStack);
	const { auth, awsProfile }: IAuthStack = use(AuthStack);

	const apiProps: ApiProps<AuthorizedApi> = {
		authorizers: {
			jwt: {
				type: "user_pool",
				userPool: {
					id: auth.userPoolId,
					clientIds: [auth.userPoolClientId],
				},
			},
		},
		defaults: {
			function: {
				bind: [database],
				nodejs: {
					esbuild: {
						plugins: [esBuildDecoratorPlugin],
					},
				},
				environment: {
					NODE_ENV: app.stage,
					APP_NAME: app.name,
					APP_VERSION: Config.get("APP_VERSION"),
					AWS_PROFILE: awsProfile,
					DB_NAME: database.defaultDatabaseName,
					DB_USER: databaseUser,
					DB_SECRET_ARN: database.secretArn,
					DB_RESOURCE_ARN: database.clusterArn,
				},
			},
		},
		routes: await routeRegisterHandler(),
	};

	const api: Api<AuthorizedApi> = new Api<AuthorizedApi>(stack, ApiConst.API_ID, apiProps);

	auth.attachPermissionsForAuthUsers(stack, [api]);

	stack.addOutputs({
		apiUrl: api.url,
	});

	return { api };
};
