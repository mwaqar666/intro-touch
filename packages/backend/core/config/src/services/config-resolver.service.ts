import { AuthDriver } from "@/backend-core/authentication/enums";
import type { Key } from "@/stacks/types";
import { ConfigConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IConfig, IConfigValidation } from "@/backend-core/config/types";

export class ConfigResolverService implements IAppConfigResolver {
	private configCache: IConfig;

	public buildConfig(schema: IConfigValidation): void {
		this.configCache = {
			app: {
				env: schema[ConfigConst.NODE_ENV],
				name: schema[ConfigConst.APP_NAME],
				version: schema[ConfigConst.APP_VERSION],
				region: schema[ConfigConst.APP_REGION],
				key: schema[ConfigConst.APP_KEY],
			},
			auth: {
				googleClientId: schema[ConfigConst.GOOGLE_CLIENT_ID],
				facebookClientId: schema[ConfigConst.FACEBOOK_CLIENT_ID],
				facebookClientSecret: schema[ConfigConst.FACEBOOK_CLIENT_SECRET],
				redirectUrl: schema[ConfigConst.REDIRECT_URL],
				tokenExpiry: schema[ConfigConst.TOKEN_EXPIRY],
				authDrivers: {
					[AuthDriver.DEFAULT]: {
						repository: import("@/backend/user/db/repositories").then((repositories) => repositories.UserRepository),
					},
				},
			},
			email: {
				emailFrom: schema[ConfigConst.EMAIL_FROM],
			},
			frontend: {
				url: schema[ConfigConst.FRONTEND_URL],
			},
			database: {
				databaseName: schema[ConfigConst.DB_NAME],
				databaseHost: schema[ConfigConst.DB_HOST],
				databasePort: parseInt(schema[ConfigConst.DB_PORT]),
				databaseUser: schema[ConfigConst.DB_USER],
				databasePass: schema[ConfigConst.DB_PASS],
				databaseToken: schema[ConfigConst.DB_TOKEN],
			},
			storage: {
				driver: schema[ConfigConst.STORAGE_DRIVER],
			},
		};
	}

	public resolveConfig<T extends Key<IConfig>>(key: T): IConfig[T] {
		return this.configCache[key];
	}
}
