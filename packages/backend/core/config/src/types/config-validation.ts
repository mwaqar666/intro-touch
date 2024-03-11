import type { StorageDriver } from "@/backend-core/storage/enums";
import type { ConfigConst } from "@/backend-core/config/const";

export interface IConfigValidation {
	[ConfigConst.NODE_ENV]: string;
	[ConfigConst.APP_NAME]: string;
	[ConfigConst.APP_VERSION]: string;
	[ConfigConst.APP_REGION]: string;
	[ConfigConst.APP_KEY]: string;

	[ConfigConst.DB_NAME]: string;
	[ConfigConst.DB_HOST]: string;
	[ConfigConst.DB_PORT]: string;
	[ConfigConst.DB_USER]: string;
	[ConfigConst.DB_PASS]: string;
	[ConfigConst.DB_TOKEN]: string;

	[ConfigConst.STORAGE_DRIVER]: StorageDriver;

	[ConfigConst.GOOGLE_CLIENT_ID]: string;
	[ConfigConst.FACEBOOK_CLIENT_ID]: string;
	[ConfigConst.FACEBOOK_CLIENT_SECRET]: string;
	[ConfigConst.REDIRECT_URL]: string;
	[ConfigConst.TOKEN_EXPIRY]: string;

	[ConfigConst.EMAIL_FROM]: string;

	[ConfigConst.FRONTEND_URL]: string;
}
