import type { Key } from "@/stacks/types";
import { ConfigConst } from "@/backend/config/const";
import { EnvExtractor } from "@/backend/config/helpers";
import type { IConfigResolver } from "@/backend/config/interface";
import type { IConfig, IConfigValidation } from "@/backend/config/types";

export class ConfigResolverService implements IConfigResolver<IConfig, IConfigValidation> {
	private configCache: IConfig;

	public buildConfig(schema: IConfigValidation): void {
		this.configCache = {
			app: {
				name: EnvExtractor.env(schema, ConfigConst.APP_NAME),
				env: EnvExtractor.env(schema, ConfigConst.NODE_ENV),
				version: EnvExtractor.env(schema, ConfigConst.APP_VERSION),
			},
			database: {
				database: EnvExtractor.env(schema, ConfigConst.DB_NAME),
				schema: EnvExtractor.env(schema, ConfigConst.DB_SCHEMA),
				host: EnvExtractor.env(schema, ConfigConst.DB_HOST),
				port: parseInt(EnvExtractor.env(schema, ConfigConst.DB_PORT), 10),
				username: EnvExtractor.env(schema, ConfigConst.DB_USER),
				password: EnvExtractor.env(schema, ConfigConst.DB_PASS),
			},
		};
	}

	public resolveConfig<T extends Key<IConfig>>(key: T): IConfig[T] {
		return this.configCache[key];
	}
}
