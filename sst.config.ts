import { resolve } from "node:path";
import { RemovalPolicy } from "aws-cdk-lib";
import type { DotenvConfigOutput } from "dotenv";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import type { App } from "sst/constructs";
import type { ConfigOptions, SSTConfig } from "sst/project";
import { Config } from "@/stacks/config";
import { ApiStack, AuthStack, DatabaseStack } from "@/stacks/stacks";

export default {
	config({ stage }): ConfigOptions {
		const appStage: string = stage ?? "dev";

		const dotEnvFilePath: string = resolve(`.env.${appStage}`);
		const environment: DotenvConfigOutput = config({ path: dotEnvFilePath });
		expand(environment);

		return {
			name: Config.get("APP_NAME"),
			region: Config.get("APP_REGION"),
			stage: appStage,
		};
	},
	async stacks(app: App): Promise<void> {
		app.setDefaultFunctionProps({
			runtime: "nodejs18.x",
			architecture: "arm_64",
		});

		app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

		app.stack(AuthStack);
		app.stack(DatabaseStack);
		await app.stack(ApiStack);
	},
} satisfies SSTConfig;
