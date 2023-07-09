import type { StackContext } from "sst/constructs";
import { Auth, use } from "sst/constructs";
import { AuthConst } from "@/stacks/const";
import type { IApiStack } from "@/stacks/stacks/ApiStack";
import { ApiStack } from "@/stacks/stacks/ApiStack";

export interface IAuthStack {
	auth: Auth;
}

export const AuthStack = ({ app, stack }: StackContext): IAuthStack => {
	const { api, defaultFunctionProps }: IApiStack = use(ApiStack);

	const auth: Auth = new Auth(stack, AuthConst.ApiAuthId(app.stage), {
		authenticator: {
			...defaultFunctionProps,
			handler: "packages/backend/core/ignition/src/handlers/auth-invoker-handler.authInvokerHandler",
		},
	});

	auth.attach(stack, {
		api,
		prefix: "/auth",
	});

	stack.addOutputs({
		awsProfile: app.account,
		authId: auth.id,
	});

	return {
		auth,
	};
};
