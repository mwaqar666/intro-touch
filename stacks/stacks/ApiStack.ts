import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { routeRegisterHandler } from "@/backend/ignition/handlers";
import { ApiConst } from "@/stacks/const";
import { esBuildDecoratorPlugin } from "@/stacks/plugins";
import type { IAuthStack } from "@/stacks/stacks/AuthStack";
import { AuthStack } from "@/stacks/stacks/AuthStack";
import type { AuthorizedApi } from "@/stacks/types";

export interface IApiStack {
	api: Api<AuthorizedApi>;
}

export const ApiStack = async ({ stack }: StackContext): Promise<IApiStack> => {
	const { auth }: IAuthStack = use(AuthStack);

	// Create Api
	const api: Api<AuthorizedApi> = new Api<AuthorizedApi>(stack, ApiConst.ApplicationLambdaId, {
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
			},
		},
		routes: await routeRegisterHandler(),
	});

	// attach permissions for authenticated users to the api
	auth.attachPermissionsForAuthUsers(stack, [api]);

	stack.addOutputs({
		apiUrl: api.url,
	});

	return { api };
};
