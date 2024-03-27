import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";
import { App } from "@/backend-core/core/extensions";
import { Request } from "@/backend-core/request-processor/handlers";
import type { Nullable, Optional } from "@/stacks/types";
import type { ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";

export function IsCurrentPassword(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: { message: `${propertyName}: Invalid old password`, ...validationOptions },
			constraints: [],
			validator: CurrentPasswordConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class CurrentPasswordConstraint implements ValidatorConstraintInterface {
	public async validate(value: Optional<string>): Promise<boolean> {
		if (!value) return false;

		const request: Request = App.container.resolve(Request);

		const userEntity: Nullable<IAuthenticatableEntity> = await request.auth();
		if (!userEntity) return false;

		return await userEntity.verifyPassword(value);
	}
}
