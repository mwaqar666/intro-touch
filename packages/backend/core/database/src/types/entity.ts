import type { Constructable, FilterWhereNot, Key, Nullable } from "@/stacks/types";
import type { ScopeOptions } from "sequelize";
import type { ScopesOptions } from "sequelize-typescript";
import type { EntityScopeConst } from "@/backend-core/database/const";
import type { BaseEntity } from "@/backend-core/database/entity";

export type EntityScope = Array<string | ScopeOptions>;

export type EntityRelationshipPropertyTypes = Nullable<BaseEntity<any>> | BaseEntity<any> | Array<BaseEntity<any>>;

export type EntityKeyValues<TEntity extends BaseEntity<TEntity>> = { [TProp in Key<TEntity>]: TEntity[TProp] };

export type BaseEntityKeyValues<TEntity extends BaseEntity<TEntity>> = { [TProp in Key<BaseEntity<TEntity>>]: BaseEntity<TEntity>[TProp] };

export type EntityProperties<TEntity extends BaseEntity<TEntity>> = Omit<EntityKeyValues<TEntity>, Key<BaseEntityKeyValues<TEntity>>>;

export type EntityNonTableColumnProperties = EntityRelationshipPropertyTypes | ((...params: any) => any);

export type EntityTableColumnProperties<TEntity extends BaseEntity<TEntity>> = FilterWhereNot<EntityProperties<TEntity>, EntityNonTableColumnProperties>;

export interface IRelationship<TEntity extends BaseEntity<TEntity>> {
	propertyKey: string;
	entityOrEntities: BaseEntity<TEntity> | Array<BaseEntity<TEntity>>;
}

export type EntityScopes<T> = { [K in Key<T>]: ScopesOptions };

export type AvailableScopes = EntityScopes<typeof EntityScopeConst>;

export type EntityType<TEntity extends BaseEntity<TEntity>> = Constructable<TEntity, any> & typeof BaseEntity<TEntity>;
