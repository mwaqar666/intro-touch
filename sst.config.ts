import { env } from "process";
import { RemovalPolicy } from "aws-cdk-lib";
import type { App } from "sst/constructs";
import type { ConfigOptions, SSTConfig } from "sst/project";
import { ApiStack, AuthStack, DatabaseStack } from "./stacks/stacks";

export default {
	config(): ConfigOptions {
		return {
			name: "intro-touch",
			region: "us-east-2",
		};
	},
	stacks(app: App): void {
		app.setDefaultFunctionProps({
			runtime: "nodejs18.x",
			environment: {
				STAGE: app.stage,
				NODE_ENV: <string>env["NODE_ENV"],
			},
			architecture: "arm_64",
		});

		app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

		app.stack(AuthStack);
		app.stack(ApiStack);
		app.stack(DatabaseStack);
	},
} satisfies SSTConfig;
