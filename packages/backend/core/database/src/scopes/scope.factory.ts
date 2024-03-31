import type { Delegate } from "@/stacks/types";
import type { FindOptions } from "sequelize";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IAvailableScopes, IEntityType } from "@/backend-core/database/types";

export class ScopeFactory<TEntity extends BaseEntity<TEntity>> {
	private constructor(
		private model: IEntityType<TEntity>,
		private scopes: Partial<IAvailableScopes> = {},
	) {}

	public static commonScopes<TEntityStatic extends BaseEntity<TEntityStatic>>(modelCallback: () => typeof BaseEntity<TEntityStatic>): Partial<IAvailableScopes> {
		const modelGetterCallback: Delegate<[], IEntityType<TEntityStatic>> = modelCallback as Delegate<[], IEntityType<TEntityStatic>>;
		const scopesInstance: ScopeFactory<TEntityStatic> = new ScopeFactory(modelGetterCallback());

		scopesInstance
			// Handle scope logic according to their business in separate methods
			.preparePrimaryKeyScopes()
			.prepareUuidKeyScopes()
			.prepareTimestampsScopes()
			.prepareWithoutSelectionScope()
			.prepareActiveColumnScope()
			.prepareColumnInclusionScope();

		return scopesInstance.scopes;
	}

	private preparePrimaryKeyScopes(): ScopeFactory<TEntity> {
		this.scopes["primaryKeyOnly"] = {
			attributes: [this.model.primaryKeyAttribute],
		};

		return this;
	}

	private prepareUuidKeyScopes(): ScopeFactory<TEntity> {
		if (!this.model.uuidColumnName) return this;

		this.scopes["primaryKeyAndUuidOnly"] = {
			attributes: [this.model.primaryKeyAttribute, this.model.uuidColumnName],
		};

		return this;
	}

	private prepareTimestampsScopes(): ScopeFactory<TEntity> {
		const availableTimestamps: Array<string> = [];

		if (this.model.createdAtColumnName) availableTimestamps.push(this.model.createdAtColumnName);
		if (this.model.updatedAtColumnName) availableTimestamps.push(this.model.updatedAtColumnName);
		if (this.model.deletedAtColumnName) availableTimestamps.push(this.model.deletedAtColumnName);

		if (availableTimestamps.length) {
			this.scopes["withoutTimestamps"] = {
				attributes: { exclude: availableTimestamps },
			};
		}
		return this;
	}

	private prepareWithoutSelectionScope(): ScopeFactory<TEntity> {
		this.scopes["withoutSelection"] = { attributes: [] };

		return this;
	}

	private prepareActiveColumnScope(): ScopeFactory<TEntity> {
		if (this.model.isActiveColumnName) this.scopes["isActive"] = { where: { [this.model.isActiveColumnName]: true } };

		return this;
	}

	private prepareColumnInclusionScope(): ScopeFactory<TEntity> {
		this.scopes["withColumns"] = (...columnsToInclude: Array<string>): FindOptions => ({
			attributes: [this.model.primaryKeyAttribute, this.model.uuidColumnName, ...columnsToInclude],
		});

		return this;
	}
}
