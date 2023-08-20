import { App } from "@/backend-core/core/extensions";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { BaseRepository } from "@/backend-core/database/repository";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestHandler } from "@/backend-core/request-processor/interface";
import type { IResolvedRoute } from "@/backend-core/router/interface";
import type { Optional } from "@/stacks/types";
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";
import type { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import type { IUniqueValidatorIgnoreOptions, IUniqueValidatorOptions } from "@/backend-core/validation/types";

export function IsUnique<T extends BaseEntity<T>, R extends BaseRepository<T>>(isUniqueOptions: IUniqueValidatorOptions<T, R>, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: { message: `${propertyName}: $value already exists`, ...validationOptions },
			constraints: [isUniqueOptions],
			validator: IsUniqueConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint<T extends BaseEntity<T>, R extends BaseRepository<T>> implements ValidatorConstraintInterface {
	public async validate(value: Optional<string>, args: ValidationArguments): Promise<boolean> {
		const [validationConstraints]: [IUniqueValidatorOptions<T, R>] = <[IUniqueValidatorOptions<T, R>]>args.constraints;

		const repository: R = App.container.resolve(validationConstraints.repository);

		let where: WhereOptions<T> = <WhereOptions<T>>{ [validationConstraints.column ?? args.property]: value };

		if ("ignoreByParameter" in validationConstraints) where = { ...where, ...this.createIgnoreRowClause(validationConstraints) };

		const entityCount: number = await repository.count({
			findOptions: { where, paranoid: false },
		});

		return entityCount === 0;
	}

	private createIgnoreRowClause(ignoreUniqueOptions: IUniqueValidatorIgnoreOptions<T, R>): WhereOptions<T> {
		const requestHandler: IRequestHandler = App.container.resolve(RequestProcessorTokenConst.RequestHandlerToken);

		const currentRoute: IResolvedRoute = requestHandler.getRoute();

		const columnValueToIgnore: Optional<string> = currentRoute[ignoreUniqueOptions.extractParameterFrom === "path" ? "pathParams" : "queryParams"][ignoreUniqueOptions.ignoreByParameter];

		if (!columnValueToIgnore) return {};

		return <WhereOptions<T>>{ [ignoreUniqueOptions.ignoreByParameter]: { [Op.ne]: columnValueToIgnore } };
	}
}
