import type { UserEntity } from "@/backend/user/db/entities";
import { App } from "@/backend-core/core/extensions";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestHandler } from "@/backend-core/request-processor/interface";
import type { IAuthAppRequest } from "@/backend-core/request-processor/types";
import type { Optional } from "@/stacks/types";
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

		const requestHandler: IRequestHandler = App.container.resolve(RequestProcessorTokenConst.RequestHandlerToken);

		const authRequest: IAuthAppRequest<UserEntity> = requestHandler.getRequest() as IAuthAppRequest<UserEntity>;
		if (!authRequest.auth) return false;

		return await authRequest.auth.verifyPassword(value);
	}
}
