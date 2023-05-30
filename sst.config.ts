import { resolve } from "node:path";
import { env } from "node:process";
import { RemovalPolicy } from "aws-cdk-lib";
import { config } from "dotenv";
import type { App } from "sst/constructs";
import type { ConfigOptions, SSTConfig } from "sst/project";
import { ApiStack, AuthStack, DatabaseStack } from "@/stacks/stacks";

export default {
	config({ stage }): ConfigOptions {
		config({ path: resolve(`.env.${stage ?? "dev"}`) });

		return {
			name: "intro-touch",
			region: "us-east-2",
		};
	},
	async stacks(app: App): Promise<void> {
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
		app.stack(DatabaseStack);
		await app.stack(ApiStack);
	},
} satisfies SSTConfig;
