import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { routeRegisterHandler } from "@/backend-core/ignition/handlers/route-register-handler";
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

export const ApiStack = async ({ stack }: StackContext): Promise<IApiStack> => {
	const { auth, awsProfile }: IAuthStack = use(AuthStack);
	const { database, databaseUser }: IDatabaseStack = use(DatabaseStack);

	const api: Api<AuthorizedApi> = new Api<AuthorizedApi>(stack, ApiConst.ApplicationApi, {
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
					DB_NAME: database.defaultDatabaseName,
					DB_USER: databaseUser,
					DB_SECRET_ARN: database.secretArn,
					DB_RESOURCE_ARN: database.clusterArn,
					AWS_PROFILE: awsProfile,
				},
			},
		},
		routes: await routeRegisterHandler(),
	});

	auth.attachPermissionsForAuthUsers(stack, [api]);

	stack.addOutputs({
		apiUrl: api.url,
	});

	return { api };
};
