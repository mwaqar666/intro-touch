import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import type { Constructable } from "@/stacks/types";
import { plainToInstance } from "class-transformer";
import type { ValidationError } from "class-validator";
import { validate } from "class-validator";
import type { IValidator } from "@/backend-core/validation/interface";

export class ValidatorService implements IValidator {
	public async validate<Schema extends object, Data extends Schema = Schema>(schema: Constructable<Schema>, data: Data): Promise<Schema> {
		const transformedObject: Schema = plainToInstance(schema, data);

		const errors: Array<ValidationError> = await validate(transformedObject, {
			whitelist: true,
		});

		if (errors.length === 0) return transformedObject;

		const validationErrors: Record<string, Array<string>> = {};

		for (const validationError of errors) {
			validationErrors[validationError.property] = validationError.constraints ? Object.values(validationError.constraints) : [];
		}

		throw new BadRequestException("Request validation failed", { validationErrors });
	}
}
