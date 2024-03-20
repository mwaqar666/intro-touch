import type { Key, Optional } from "@/stacks/types";
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";

export function IsSameAsField(fieldName: string, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: { message: `${propertyName}: "$value" must be same as "${fieldName}"`, ...validationOptions },
			constraints: [fieldName],
			validator: IsSameAsFieldConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class IsSameAsFieldConstraint implements ValidatorConstraintInterface {
	public async validate(value: Optional<string>, args: ValidationArguments): Promise<boolean> {
		if (!value) return false;

		const [fieldName]: [string] = <[string]>args.constraints;
		const fieldToCompare: Optional<string> = args.object[fieldName as Key<object>];

		return fieldToCompare === value;
	}
}
