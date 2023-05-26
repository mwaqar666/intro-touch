import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { routeRegister } from "@/backend/ignition/handler";
import { ApiConst } from "@/stacks/const";
import type { IAuthStack } from "@/stacks/stacks/AuthStack";
import { AuthStack } from "@/stacks/stacks/AuthStack";
import type { AuthorizedApi } from "@/stacks/types";

export interface IApiStack {
	api: Api<AuthorizedApi>;
}

export const ApiStack = ({ stack }: StackContext): IApiStack => {
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
			authorizer: "jwt",
		},
		routes: routeRegister(),
	});

	// attach permissions for authenticated users to the api
	auth.attachPermissionsForAuthUsers(stack, [api]);

	stack.addOutputs({
		apiUrl: api.url,
	});

	return { api };
};
