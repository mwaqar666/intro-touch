import type { StackContext } from "sst/constructs";
import { Cognito } from "sst/constructs";
import { AuthConst } from "@/stacks/const";

export interface IAuthStack {
	auth: Cognito;
}

export const AuthStack = ({ stack }: StackContext): IAuthStack => {
	const auth: Cognito = new Cognito(stack, AuthConst.CognitoUserPool, {
		login: ["email", "username"],
	});

	stack.addOutputs({
		cognitoUserPoolId: auth.userPoolId,
		cognitoUserPoolClientId: auth.userPoolClientId,
	});

	return { auth };
};
