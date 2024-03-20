import type { Constructable, FilterWhereNot, Key, Nullable } from "@/stacks/types";
import type { ScopeOptions } from "sequelize";
import type { ScopesOptions } from "sequelize-typescript";
import type { EntityScopeConst } from "@/backend-core/database/const";
import type { BaseEntity } from "@/backend-core/database/entity";

export type IEntityScope = Array<string | ScopeOptions>;

export type IEntityRelationshipPropertyTypes = Nullable<BaseEntity> | BaseEntity | Array<BaseEntity>;

export type IEntityKeyValues<TEntity extends BaseEntity<TEntity>> = { [TProp in Key<TEntity>]: TEntity[TProp] };

export type IBaseEntityKeyValues<TEntity extends BaseEntity<TEntity>> = { [TProp in Key<BaseEntity<TEntity>>]: BaseEntity<TEntity>[TProp] };

export type IEntityProperties<TEntity extends BaseEntity<TEntity>> = Omit<IEntityKeyValues<TEntity>, Key<IBaseEntityKeyValues<TEntity>>>;

export type IEntityNonTableColumnProperties = IEntityRelationshipPropertyTypes | ((...params: any) => any);

export type IEntityTableColumnProperties<TEntity extends BaseEntity<TEntity>> = FilterWhereNot<IEntityProperties<TEntity>, IEntityNonTableColumnProperties>;

export type IEntityTableColumnPropertiesExcept<TEntity extends BaseEntity<TEntity>, TProps extends Key<TEntity> = Key<TEntity>> = Omit<IEntityTableColumnProperties<TEntity>, TProps>;

export type IEntityScopes<T> = { [K in Key<T>]: ScopesOptions };

export type IAvailableScopes = IEntityScopes<typeof EntityScopeConst>;

export type IEntityType<TEntity extends BaseEntity<TEntity> = BaseEntity> = Constructable<TEntity> & typeof BaseEntity<TEntity>;
