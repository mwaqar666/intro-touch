import type { IAnyObject } from "@/stacks/types";
import type { ObjectSchema, ValidationResult } from "joi";
import * as joi from "joi";
import { ConfigConst } from "@/backend-core/config/const";
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
				[ConfigConst.NODE_ENV]: joi.string().default("dev"),
				[ConfigConst.APP_NAME]: joi.string().required(),
				[ConfigConst.APP_VERSION]: joi.string().required(),

				[ConfigConst.AWS_ACCOUNT]: joi.string().required(),

				[ConfigConst.DB_NAME]: joi.string().required(),
				[ConfigConst.DB_USER]: joi.string().required(),
				[ConfigConst.DB_SECRET_ARN]: joi.string().default(""),
				[ConfigConst.DB_RESOURCE_ARN]: joi.string().default(""),
			})
			.unknown(true);
	}
}
