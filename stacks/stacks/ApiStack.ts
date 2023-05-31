import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
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
	const { auth }: IAuthStack = use(AuthStack);
	const { database }: IDatabaseStack = use(DatabaseStack);

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
				nodejs: {
					esbuild: {
						plugins: [esBuildDecoratorPlugin],
					},
				},
				bind: [database],
			},
		},
		routes: {
			$default: "packages/backend/ignition/src/handlers/route-invoker-handler.index",
		},
	});

	auth.attachPermissionsForAuthUsers(stack, [api]);

	stack.addOutputs({
		apiUrl: api.url,
	});

	return { api };
};
