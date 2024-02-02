import { resolve } from "node:path";
import type { DotenvConfigOutput } from "dotenv";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import type { App } from "sst/constructs";
import type { ConfigOptions, SSTConfig } from "sst/project";
import { Config } from "@/stacks/config";
import { ApiStack, AuthStack, DatabaseStack, EmailStack, VpcStack } from "@/stacks/stacks";

export default {
	config({ stage }): ConfigOptions {
		stage = stage ?? "dev";

		const dotEnvFilePath: string = resolve(`.env.${stage}`);
		const environment: DotenvConfigOutput = config({ path: dotEnvFilePath });

		expand(environment);

		return {
			name: Config.get("APP_NAME"),
			region: "us-east-2",
			stage,
		};
	},
	async stacks(app: App): Promise<void> {
		if (Config.isNotLocal(app.stage)) {
			app.stack(VpcStack);
		}

		app.stack(DatabaseStack);

		await app.stack(EmailStack);
		await app.stack(ApiStack);

		app.stack(AuthStack);
	},
} satisfies SSTConfig;
