import type { Key, Optional } from "@/stacks/types";
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";

export function MatchField(fieldName: string, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: { message: `${propertyName}: "$value" must match "${fieldName}"`, ...validationOptions },
			constraints: [fieldName],
			validator: MatchFieldConstraint,
		});
	};
}

@ValidatorConstraint()
export class MatchFieldConstraint implements ValidatorConstraintInterface {
	public validate(value: Optional<string>, args: ValidationArguments): boolean {
		if (!value) return false;

		const [fieldName]: [string] = <[string]>args.constraints;
		const fieldToCompare: Optional<string> = args.object[fieldName as Key<object>];

		return fieldToCompare === value;
	}
}
