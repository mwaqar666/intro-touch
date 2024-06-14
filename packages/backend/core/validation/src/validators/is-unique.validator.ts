import { App } from "@/backend-core/core/extensions";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { BaseRepository } from "@/backend-core/database/repository";
import { Request } from "@/backend-core/request-processor/handlers";
import type { Optional } from "@/stacks/types";
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";
import type { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import type { IExtractParametersFrom, IUniqueValidatorIgnoreOptions, IUniqueValidatorOptions } from "@/backend-core/validation/types";

export function IsUnique<T extends BaseEntity<T>, R extends BaseRepository<T>>(isUniqueOptions: IUniqueValidatorOptions<T, R>, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: { message: `${propertyName} “$value” already exists`, ...validationOptions },
			constraints: [isUniqueOptions],
			validator: IsUniqueConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint<T extends BaseEntity<T>, R extends BaseRepository<T>> implements ValidatorConstraintInterface {
	public async validate(value: Optional<string>, args: ValidationArguments): Promise<boolean> {
		if (!value) return false;

		const [validationConstraints]: [IUniqueValidatorOptions<T, R>] = <[IUniqueValidatorOptions<T, R>]>args.constraints;

		const repository: R = App.container.resolve(validationConstraints.repository);

		let where: WhereOptions<T> = <WhereOptions<T>>{ [validationConstraints.column ?? args.property]: value };

		if ("ignoreByParameter" in validationConstraints) {
			where = {
				[Op.and]: [where, await this.createIgnoreRowClause(validationConstraints)],
			};
		}

		const entityCount: number = await repository.count({
			findOptions: { where, paranoid: false },
		});

		return entityCount === 0;
	}

	private async createIgnoreRowClause(ignoreUniqueOptions: IUniqueValidatorIgnoreOptions<T, R>): Promise<WhereOptions<T>> {
		const columnValueToIgnore: Optional<string> = await this.extractColumnValueToIgnoreFromRequest(ignoreUniqueOptions.extractParameterFrom, ignoreUniqueOptions.ignoreByParameter);

		if (!columnValueToIgnore) return {};

		return <WhereOptions<T>>{ [ignoreUniqueOptions.ignoreByParameter]: { [Op.ne]: columnValueToIgnore } };
	}

	private async extractColumnValueToIgnoreFromRequest(parameterSource: IExtractParametersFrom, parameter: string): Promise<Optional<string>> {
		const request: Request = App.container.resolve(Request);

		switch (parameterSource) {
			case "path":
				return request.getPathParams(parameter);

			case "query":
				return request.getQueryParams(parameter);

			case "body":
				return await request.getBody(parameter as never);
		}
	}
}
