import type { NumberSchema, StringSchema } from "joi";
import type { ConfigConst } from "@/backend/config/const";

export interface IConfigValidation {
	[ConfigConst.NODE_ENV]: StringSchema<string>;
	[ConfigConst.APP_NAME]: StringSchema<string>;
	[ConfigConst.APP_VERSION]: StringSchema<string>;

	[ConfigConst.DB_NAME]: StringSchema<string>;
	[ConfigConst.DB_SCHEMA]: StringSchema<string>;
	[ConfigConst.DB_HOST]: StringSchema<string>;
	[ConfigConst.DB_PORT]: NumberSchema<string>;
	[ConfigConst.DB_USER]: StringSchema<string>;
	[ConfigConst.DB_PASS]: StringSchema<string>;
}
