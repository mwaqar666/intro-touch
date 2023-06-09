import type { StringSchema } from "joi";
import type { ConfigConst } from "@/backend-core/config/const";

export interface IConfigValidation {
	[ConfigConst.NODE_ENV]: StringSchema<string>;
	[ConfigConst.APP_NAME]: StringSchema<string>;
	[ConfigConst.APP_VERSION]: StringSchema<string>;

	[ConfigConst.AWS_PROFILE]: StringSchema<string>;

	[ConfigConst.DB_NAME]: StringSchema<string>;
	[ConfigConst.DB_USER]: StringSchema<string>;
	[ConfigConst.DB_SECRET_ARN]: StringSchema<string>;
	[ConfigConst.DB_RESOURCE_ARN]: StringSchema<string>;
}
