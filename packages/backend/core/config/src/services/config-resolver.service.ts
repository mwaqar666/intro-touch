import type { Key } from "@/stacks/types";
import { ConfigConst } from "@/backend-core/config/const";
import { EnvExtractor } from "@/backend-core/config/helpers";
import type { IConfigResolver } from "@/backend-core/config/interface";
import type { IConfig, IConfigValidation } from "@/backend-core/config/types";

export class ConfigResolverService implements IConfigResolver<IConfig, IConfigValidation> {
	private configCache: IConfig;

	public buildConfig(schema: IConfigValidation): void {
		this.configCache = {
			app: {
				name: EnvExtractor.env(schema, ConfigConst.APP_NAME),
				env: EnvExtractor.env(schema, ConfigConst.NODE_ENV),
				version: EnvExtractor.env(schema, ConfigConst.APP_VERSION),
			},
			account: {
				profile: EnvExtractor.env(schema, ConfigConst.AWS_PROFILE),
			},
			database: {
				database: EnvExtractor.env(schema, ConfigConst.DB_NAME),
				databaseUser: EnvExtractor.env(schema, ConfigConst.DB_USER),
				secretArn: EnvExtractor.env(schema, ConfigConst.DB_SECRET_ARN),
				resourceArn: EnvExtractor.env(schema, ConfigConst.DB_RESOURCE_ARN),
			},
		};
	}

	public resolveConfig<T extends Key<IConfig>>(key: T): IConfig[T] {
		return this.configCache[key];
	}
}
