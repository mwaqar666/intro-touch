import type { Key } from "@/stacks/types";
import type { ModelStatic } from "sequelize";
import { BeforeCreate, Model } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import type { EntityScope } from "@/backend-core/database/types";

export abstract class BaseEntity<TEntity extends BaseEntity<TEntity>> extends Model<TEntity> {
	// Table & Column Name Information
	public static uuidColumnName: string;
	public static isActiveColumnName: string;

	// Column Exposure Information
	public static readonly exposePrimaryKey = false;
	public static readonly exposeForeignKeys: Array<string> = [];

	// Timestamps Information
	public static createdAtColumnName: string;
	public static updatedAtColumnName: string;
	public static deletedAtColumnName: string;

	public static applyScopes<TEntityStatic extends BaseEntity<TEntityStatic>>(this: ModelStatic<TEntityStatic>, providedScopes?: EntityScope): ModelStatic<TEntityStatic> {
		let scopesToApply: EntityScope = ["defaultScope"];

		if (providedScopes) scopesToApply = scopesToApply.concat(providedScopes);

		return this.scope(scopesToApply);
	}

	@BeforeCreate
	public static generateUuid<TEntityStatic extends BaseEntity<TEntityStatic>>(model: TEntityStatic): void {
		if (!BaseEntity.uuidColumnName) return;

		const existingUuid = model[<Key<BaseEntity<TEntityStatic>>>BaseEntity.uuidColumnName];
		if (existingUuid) return;

		model[<Key<BaseEntity<TEntityStatic>>>BaseEntity.uuidColumnName] = uuid();
	}

	public removeDataValue(this: TEntity, key: keyof TEntity): void {
		this.changed(key, true);

		delete this.dataValues[key];
	}
}
