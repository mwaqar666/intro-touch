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
				env: EnvExtractor.env(schema, ConfigConst.NODE_ENV),
				name: EnvExtractor.env(schema, ConfigConst.APP_NAME),
				version: EnvExtractor.env(schema, ConfigConst.APP_VERSION),
			},
			database: {
				databaseName: EnvExtractor.env(schema, ConfigConst.DB_NAME),
				databaseHost: EnvExtractor.env(schema, ConfigConst.DB_HOST),
				databasePort: parseInt(EnvExtractor.env(schema, ConfigConst.DB_PORT)),
				databaseUser: EnvExtractor.env(schema, ConfigConst.DB_USER),
				databasePass: EnvExtractor.env(schema, ConfigConst.DB_PASS),
			},
		};
	}

	public resolveConfig<T extends Key<IConfig>>(key: T): IConfig[T] {
		return this.configCache[key];
	}
}
