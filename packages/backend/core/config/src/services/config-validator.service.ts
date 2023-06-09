import type { IAnyObject } from "@/stacks/types";
import type { ObjectSchema, ValidationResult } from "joi";
import * as joi from "joi";
import { ConfigConst, ConfigDefaultConst } from "@/backend-core/config/const";
import type { IConfigValidator } from "@/backend-core/config/interface";
import type { IConfigValidation } from "@/backend-core/config/types";

export class ConfigValidatorService implements IConfigValidator<IConfigValidation> {
	public validateConfig(config: IAnyObject): IConfigValidation {
		console.log(ConfigConst.NODE_ENV, config[ConfigConst.NODE_ENV]);
		console.log(ConfigConst.APP_NAME, config[ConfigConst.APP_NAME]);
		console.log(ConfigConst.APP_VERSION, config[ConfigConst.APP_VERSION]);
		console.log(ConfigConst.AWS_PROFILE, config[ConfigConst.AWS_PROFILE]);
		console.log(ConfigConst.DB_NAME, config[ConfigConst.DB_NAME]);
		console.log(ConfigConst.DB_USER, config[ConfigConst.DB_USER]);
		console.log(ConfigConst.DB_SECRET_ARN, config[ConfigConst.DB_SECRET_ARN]);
		console.log(ConfigConst.DB_RESOURCE_ARN, config[ConfigConst.DB_RESOURCE_ARN]);

		const { error, value }: ValidationResult<IConfigValidation> = this.createValidatorSchema().validate(config);

		console.log(error, config);

		if (error) throw new Error(error.message);

		return value;
	}

	private createValidatorSchema(): ObjectSchema<IConfigValidation> {
		return joi
			.object<IConfigValidation>({
				[ConfigConst.NODE_ENV]: joi.string().default(ConfigDefaultConst.ENVIRONMENT),
				[ConfigConst.APP_NAME]: joi.string().required(),
				[ConfigConst.APP_VERSION]: joi.string().required(),

				[ConfigConst.AWS_PROFILE]: joi.string().required(),

				[ConfigConst.DB_NAME]: joi.string().required(),
				[ConfigConst.DB_USER]: joi.string().default(""),
				[ConfigConst.DB_SECRET_ARN]: joi.string().default(""),
				[ConfigConst.DB_RESOURCE_ARN]: joi.string().default(""),
			})
			.unknown(true);
	}
}
