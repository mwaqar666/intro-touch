import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import { StorageDriver } from "@/backend-core/storage/enums";
import type { ObjectSchema, ValidationResult } from "joi";
import joi from "joi";
import { ConfigConst } from "@/backend-core/config/const";
import type { IConfigValidator } from "@/backend-core/config/interface";
import type { IConfigValidation } from "@/backend-core/config/types";

export class ConfigValidatorService implements IConfigValidator<IConfigValidation> {
	public validateConfig(config: unknown): IConfigValidation {
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
				[ConfigConst.APP_REGION]: joi.string().default("us-east-2"),
				[ConfigConst.APP_KEY]: joi.string().required(),

				[ConfigConst.DB_NAME]: joi.string().required(),
				[ConfigConst.DB_HOST]: joi.string().default(""),
				[ConfigConst.DB_PORT]: joi.number().default(5432),
				[ConfigConst.DB_USER]: joi.string().required(),
				[ConfigConst.DB_PASS]: joi.string().default(""),
				[ConfigConst.DB_TOKEN]: joi.string().required(),

				[ConfigConst.STORAGE_DRIVER]: joi
					.string()
					.required()
					.valid(...Object.values(StorageDriver)),

				[ConfigConst.GOOGLE_CLIENT_ID]: joi.string().required(),
				[ConfigConst.FACEBOOK_CLIENT_ID]: joi.string().required(),
				[ConfigConst.FACEBOOK_CLIENT_SECRET]: joi.string().required(),
				[ConfigConst.REDIRECT_URL]: joi.string().required(),
				[ConfigConst.TOKEN_EXPIRY]: joi.string().required(),

				[ConfigConst.EMAIL_FROM]: joi.string().required(),

				[ConfigConst.FRONTEND_URL]: joi.string().required(),
			})
			.unknown(true);
	}
}
