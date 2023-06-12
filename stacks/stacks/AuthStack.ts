import type { StackContext } from "sst/constructs";
import { Cognito } from "sst/constructs";
import { AuthConst } from "@/stacks/const";

export interface IAuthStack {
	auth: Cognito;
	awsProfile: string;
}

export const AuthStack = ({ app, stack }: StackContext): IAuthStack => {
	const auth: Cognito = new Cognito(stack, AuthConst.COGNITO_USER_POOL_ID, {
		login: ["email", "username"],
	});

	stack.addOutputs({
		awsProfile: app.account,
		cognitoUserPoolId: auth.userPoolId,
		cognitoUserPoolClientId: auth.userPoolClientId,
	});

	return {
		auth,
		awsProfile: app.account,
	};
};
