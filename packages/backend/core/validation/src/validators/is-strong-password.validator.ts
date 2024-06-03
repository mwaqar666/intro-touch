import { AuthenticationConst } from "@/backend-core/authentication/const";
import type { ValidationOptions } from "class-validator";
import { IsStrongPassword as IsStrongPasswordBase } from "class-validator";

export function IsStrongPassword(validationOptions?: ValidationOptions): PropertyDecorator {
	validationOptions ??= {};

	validationOptions.message = (): string => {
		return `Password must contain at least one uppercase & one lowercase alphabet, one digit, one symbol & must be at least 8 characters in length`;
	};

	return (target: NonNullable<unknown>, propertyKey: string | symbol) => IsStrongPasswordBase(AuthenticationConst.StrongPasswordOptions, validationOptions)(target, propertyKey);
}
