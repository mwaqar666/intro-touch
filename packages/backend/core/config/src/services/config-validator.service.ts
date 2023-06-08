import type { IAnyObject } from "@/stacks/types";
import type { ObjectSchema, ValidationResult } from "joi";
import * as joi from "joi";
import { ConfigConst, ConfigDefaultConst } from "@/backend-core/config/const";
import type { IConfigValidator } from "@/backend-core/config/interface";
import type { IConfigValidation } from "@/backend-core/config/types";

export class ConfigValidatorService implements IConfigValidator<IConfigValidation> {
	public validateConfig(config: IAnyObject): IConfigValidation {
		const { error, value }: ValidationResult<IConfigValidation> = this.createValidatorSchema().validate(config);

		if (error) throw new Error(error.message);

		return value;
	}

	private createValidatorSchema(): ObjectSchema<IConfigValidation> {
		return joi
			.object<IConfigValidation>({
				[ConfigConst.NODE_ENV]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.APP_NAME]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.APP_VERSION]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),

				[ConfigConst.DB_NAME]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.DB_SCHEMA]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.DB_HOST]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.DB_PORT]: joi.number().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.DB_USER]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.DB_PASS]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
			})
			.unknown(true);
	}
}
