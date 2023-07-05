import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import type { IAnyObject } from "@/stacks/types";
import type { ObjectSchema, ValidationResult } from "joi";
import * as joi from "joi";
import { ConfigConst } from "@/backend-core/config/const";
import type { IConfigValidator } from "@/backend-core/config/interface";
import type { IConfigValidation } from "@/backend-core/config/types";

export class ConfigValidatorService implements IConfigValidator<IConfigValidation> {
	public validateConfig(config: IAnyObject): IConfigValidation {
		const { error, value }: ValidationResult<IConfigValidation> = this.createValidatorSchema().validate(config);

		if (error) throw new BadRequestException(error.message);

		return value;
	}

	private createValidatorSchema(): ObjectSchema<IConfigValidation> {
		return joi
			.object<IConfigValidation>({
				[ConfigConst.NODE_ENV]: joi.string().default("dev"),
				[ConfigConst.APP_NAME]: joi.string().required(),
				[ConfigConst.APP_VERSION]: joi.string().required(),
				[ConfigConst.APP_KEY]: joi.string().required(),

				[ConfigConst.DB_NAME]: joi.string().required(),
				[ConfigConst.DB_HOST]: joi.string().default(""),
				[ConfigConst.DB_PORT]: joi.number().default(5432),
				[ConfigConst.DB_USER]: joi.string().required(),
				[ConfigConst.DB_PASS]: joi.string().default(""),
				[ConfigConst.DB_MIGRATION_PASS]: joi.string().required(),

				[ConfigConst.GOOGLE_CLIENT_ID]: joi.string().required(),
				[ConfigConst.REDIRECT_URL]: joi.string().required(),
				[ConfigConst.TOKEN_EXPIRY]: joi.string().required(),

				[ConfigConst.EMAIL_FROM]: joi.string().required(),
			})
			.unknown(true);
	}
}
