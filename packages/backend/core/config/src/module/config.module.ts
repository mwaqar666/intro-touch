import { AbstractModule } from "@/backend-core/core/concrete/module";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IConfigResolver, IConfigValidator } from "@/backend-core/config/interface";
import { ConfigResolverService, ConfigValidatorService } from "@/backend-core/config/services";
import type { IConfig, IConfigValidation } from "@/backend-core/config/types";

export class ConfigModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(ConfigTokenConst.ConfigResolverToken, ConfigResolverService);
		this.container.registerSingleton(ConfigTokenConst.ConfigValidatorToken, ConfigValidatorService);
	}

	public override async preBoot(): Promise<void> {
		const configResolver: IConfigResolver<IConfig, IConfigValidation> = this.container.resolve(ConfigTokenConst.ConfigResolverToken);
		const configValidator: IConfigValidator<IConfigValidation> = this.container.resolve(ConfigTokenConst.ConfigValidatorToken);

		const validatedConfig: IConfigValidation = configValidator.validateConfig(process.env);
		configResolver.buildConfig(validatedConfig);
	}
}
