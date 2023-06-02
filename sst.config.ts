import { resolve } from "node:path";
import * as process from "process";
import { RemovalPolicy } from "aws-cdk-lib";
import { config } from "dotenv";
import type { App } from "sst/constructs";
import type { ConfigOptions, SSTConfig } from "sst/project";
import { ApiStack, AuthStack, DatabaseStack } from "@/stacks/stacks";

export default {
	config({ stage }): ConfigOptions {
		config({ path: resolve(`.env.${stage ?? "dev"}`) });

		return {
			name: <string>process.env["APP_NAME"],
			region: <string>process.env["APP_REGION"],
		};
	},
	async stacks(app: App): Promise<void> {
		app.setDefaultFunctionProps({
			runtime: "nodejs18.x",
			environment: {
				NODE_ENV: app.stage,
				APP_NAME: app.name,
				APP_VERSION: <string>process.env["APP_VERSION"],
			},
			architecture: "arm_64",
		});

		app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

		app.stack(AuthStack);
		app.stack(DatabaseStack);
		await app.stack(ApiStack);
	},
} satisfies SSTConfig;
