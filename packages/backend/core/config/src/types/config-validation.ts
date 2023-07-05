import type { NumberSchema, StringSchema } from "joi";
import type { ConfigConst } from "@/backend-core/config/const";

export interface IConfigValidation {
	[ConfigConst.NODE_ENV]: StringSchema;
	[ConfigConst.APP_NAME]: StringSchema;
	[ConfigConst.APP_VERSION]: StringSchema;
	[ConfigConst.APP_KEY]: StringSchema;

	[ConfigConst.DB_NAME]: StringSchema;
	[ConfigConst.DB_HOST]: StringSchema;
	[ConfigConst.DB_PORT]: NumberSchema;
	[ConfigConst.DB_USER]: StringSchema;
	[ConfigConst.DB_PASS]: StringSchema;
	[ConfigConst.DB_MIGRATION_PASS]: StringSchema;

	[ConfigConst.GOOGLE_CLIENT_ID]: StringSchema;
	[ConfigConst.REDIRECT_URL]: StringSchema;
	[ConfigConst.TOKEN_EXPIRY]: StringSchema;

	[ConfigConst.EMAIL_FROM]: StringSchema;
}
