import type { BaseEntity } from "@/backend-core/database/entity";
import type { AvailableScopes, EntityType } from "@/backend-core/database/types";

export class ScopeFactory<TEntity extends BaseEntity<TEntity>> {
	private constructor(private model: EntityType<TEntity>, private scopes: Partial<AvailableScopes> = {}) {}

	public static commonScopes<TEntityStatic extends BaseEntity<TEntityStatic>>(modelCallback: () => typeof BaseEntity<TEntityStatic>): Partial<AvailableScopes> {
		const modelGetterCallback = modelCallback as () => EntityType<TEntityStatic>;
		const scopesInstance: ScopeFactory<TEntityStatic> = new ScopeFactory(modelGetterCallback());

		scopesInstance
			// Handle scope logic according to their business in separate methods
			.preparePrimaryKeyScopes()
			.prepareUuidKeyScopes()
			.prepareTimestampsScopes()
			.prepareActiveColumnScopes();

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

	private prepareActiveColumnScopes(): ScopeFactory<TEntity> {
		if (this.model.isActiveColumnName) this.scopes["isActive"] = { where: { [this.model.isActiveColumnName]: true } };

		return this;
	}
}
