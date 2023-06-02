import { env } from "node:process";
import { AbstractModule } from "@/backend/core/concrete/module";
import { ConfigTokenConst } from "@/backend/config/const";
import type { IConfigResolver, IConfigValidator } from "@/backend/config/interface";
import { ConfigResolverService, ConfigValidatorService } from "@/backend/config/services";
import type { IConfig, IConfigValidation } from "@/backend/config/types";

export class ConfigModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(ConfigTokenConst.ConfigResolverToken, ConfigResolverService);
		this.container.registerSingleton(ConfigTokenConst.ConfigValidatorToken, ConfigValidatorService);
	}

	public override async preBoot(): Promise<void> {
		const configResolver: IConfigResolver<IConfig, IConfigValidation> = this.container.resolve(ConfigTokenConst.ConfigResolverToken);
		const configValidator: IConfigValidator<IConfigValidation> = this.container.resolve(ConfigTokenConst.ConfigValidatorToken);

		const validatedConfig: IConfigValidation = configValidator.validateConfig(env);
		configResolver.buildConfig(validatedConfig);
	}
}
