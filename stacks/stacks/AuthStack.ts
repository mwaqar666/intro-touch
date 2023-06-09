import type { StackContext } from "sst/constructs";
import { Cognito } from "sst/constructs";
import { Config } from "@/stacks/config";
import { AuthConst } from "@/stacks/const";

export interface IAuthStack {
	auth: Cognito;
	awsProfile: string;
}

export const AuthStack = ({ stack }: StackContext): IAuthStack => {
	const awsProfile: string = Config.get("AWS_PROFILE");

	const auth: Cognito = new Cognito(stack, AuthConst.COGNITO_USER_POOL_ID, {
		login: ["email", "username"],
	});

	stack.addOutputs({
		cognitoUserPoolId: auth.userPoolId,
		cognitoUserPoolClientId: auth.userPoolClientId,
	});

	return {
		auth,
		awsProfile,
	};
};
