import { resolve } from "node:path";
import type { DotenvConfigOutput } from "dotenv";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import type { App } from "sst/constructs";
import type { ConfigOptions, SSTConfig } from "sst/project";
import { Config } from "@/stacks/config";
import { ApiStack, AuthStack, DatabaseStack, VpcStack } from "@/stacks/stacks";

export default {
	config({ stage }): ConfigOptions {
		const appStage: string = stage ?? "dev";

		const dotEnvFilePath: string = resolve(`.env.${appStage}`);
		const environment: DotenvConfigOutput = config({ path: dotEnvFilePath });
		expand(environment);

		return {
			name: Config.get("APP_NAME"),
			region: Config.get("AWS_REGION"),
			stage: appStage,
		};
	},
	async stacks(app: App): Promise<void> {
		app.stack(VpcStack);
		app.stack(DatabaseStack);
		app.stack(AuthStack);
		await app.stack(ApiStack);
	},
} satisfies SSTConfig;
