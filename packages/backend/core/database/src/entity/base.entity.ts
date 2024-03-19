import { randomUUID } from "crypto";
import type { Delegate, Key } from "@/stacks/types";
import omit from "lodash.omit";
import type { ModelStatic } from "sequelize";
import { BeforeBulkCreate, BeforeCreate, BeforeValidate, Model } from "sequelize-typescript";
import type { IEntityScope, IEntityType } from "@/backend-core/database/types";

export abstract class BaseEntity<TEntity extends BaseEntity<TEntity> = any> extends Model<TEntity> {
	// Table & Column Name Information
	public static uuidColumnName: string;
	public static isActiveColumnName: string;
	public static foreignKeyNames: Array<string> = [];

	// Column Exposure Information
	public static readonly exposePrimaryKey: boolean = false;
	public static readonly exposeForeignKeys: Array<string> = [];
	public static readonly hiddenKeys: Array<string> = [];

	// Timestamps Information
	public static createdAtColumnName: string;
	public static updatedAtColumnName: string;
	public static deletedAtColumnName: string;

	public static applyScopes<TEntityStatic extends BaseEntity<TEntityStatic>>(this: ModelStatic<TEntityStatic>, providedScopes?: IEntityScope): ModelStatic<TEntityStatic> {
		let scopesToApply: IEntityScope = ["defaultScope"];

		if (providedScopes) scopesToApply = scopesToApply.concat(providedScopes);

		return this.scope(scopesToApply);
	}

	@BeforeValidate
	@BeforeCreate
	@BeforeBulkCreate
	public static async generateUuid<TEntityStatic extends BaseEntity<TEntityStatic>>(model: TEntityStatic | Array<TEntityStatic>): Promise<void> {
		if (!BaseEntity.uuidColumnName) return;

		await BaseEntity.runHookForOneOrMoreInstances(model, async (instance: TEntityStatic): Promise<void> => {
			const existingUuid = instance[<Key<BaseEntity<TEntityStatic>>>BaseEntity.uuidColumnName];
			if (existingUuid) return;

			instance[<Key<BaseEntity<TEntityStatic>>>BaseEntity.uuidColumnName] = randomUUID();
		});
	}

	protected static async runHookForOneOrMoreInstances<TEntityStatic extends BaseEntity<TEntityStatic>>(instanceOrInstances: TEntityStatic | Array<TEntityStatic>, callback: Delegate<[TEntityStatic], Promise<void>>): Promise<void> {
		if (!Array.isArray(instanceOrInstances)) {
			return await callback(instanceOrInstances);
		}

		await Promise.all(
			instanceOrInstances.map((eachInstance: TEntityStatic): Promise<void> | void => {
				return callback(eachInstance);
			}),
		);
	}

	public override toJSON(): object {
		const keysToExclude: Array<string> = [];
		const entityStatic: IEntityType<TEntity> = this.constructor as IEntityType<TEntity>;

		if (!entityStatic.exposePrimaryKey) keysToExclude.push(entityStatic.primaryKeyAttribute);

		for (const foreignKey of entityStatic.foreignKeyNames) {
			if (entityStatic.exposeForeignKeys.includes(foreignKey)) continue;

			keysToExclude.push(foreignKey);
		}

		for (const hiddenKey of entityStatic.hiddenKeys) {
			keysToExclude.push(hiddenKey);
		}

		return omit(this.dataValues, keysToExclude);
	}
}
