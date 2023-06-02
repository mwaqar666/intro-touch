import type { AnyObject } from "@/stacks/types";
import type { ObjectSchema, ValidationResult } from "joi";
import { number, object, string } from "joi";
import { ConfigConst, ConfigDefaultConst } from "@/backend/config/const";
import type { IConfigValidator } from "@/backend/config/interface";
import type { IConfigValidation } from "@/backend/config/types";

export class ConfigValidatorService implements IConfigValidator<IConfigValidation> {
	public validateConfig(config: AnyObject): IConfigValidation {
		const { error, value }: ValidationResult<IConfigValidation> = this.createValidatorSchema().validate(config);

		if (error) throw new Error(error.message);

		return value;
	}

	private createValidatorSchema(): ObjectSchema<IConfigValidation> {
		return object<IConfigValidation>({
			[ConfigConst.NODE_ENV]: string().default(ConfigDefaultConst.ENVIRONMENT),
			[ConfigConst.APP_NAME]: string().default(ConfigDefaultConst.ENVIRONMENT),
			[ConfigConst.APP_VERSION]: string().default(ConfigDefaultConst.ENVIRONMENT),

			[ConfigConst.DB_NAME]: string().default(ConfigDefaultConst.ENVIRONMENT),
			[ConfigConst.DB_SCHEMA]: string().default(ConfigDefaultConst.ENVIRONMENT),
			[ConfigConst.DB_HOST]: string().default(ConfigDefaultConst.ENVIRONMENT),
			[ConfigConst.DB_PORT]: number().default(ConfigDefaultConst.ENVIRONMENT),
			[ConfigConst.DB_USER]: string().default(ConfigDefaultConst.ENVIRONMENT),
			[ConfigConst.DB_PASS]: string().default(ConfigDefaultConst.ENVIRONMENT),
		});
	}
}
