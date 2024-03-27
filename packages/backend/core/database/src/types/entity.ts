import type { Constructable, FilterWhereNot, Key, Nullable } from "@/stacks/types";
import type { ScopeOptions } from "sequelize";
import type { ScopesOptions } from "sequelize-typescript";
import type { EntityScopeConst } from "@/backend-core/database/const";
import type { BaseEntity } from "@/backend-core/database/entity";

export interface IEntityStringColumnOptions {
	length: number;
	nullable: boolean;
}

export type IEntityIntegerColumnOptions = Omit<IEntityStringColumnOptions, "length">;

export type IEntityDateColumnOptions = Omit<IEntityStringColumnOptions, "length">;

export type IEntityBooleanColumnOptions = Omit<IEntityStringColumnOptions, "length">;

export type IEntityTextColumnOptions = Omit<IEntityStringColumnOptions, "length">;

export type IEntityScope = Array<string | ScopeOptions>;

export type IEntityRelationshipPropertyTypes = Nullable<BaseEntity> | BaseEntity | Array<BaseEntity>;

export type IEntityKeyValues<TEntity extends BaseEntity<TEntity>> = { [TProp in Key<TEntity>]: TEntity[TProp] };

export type IBaseEntityKeyValues<TEntity extends BaseEntity<TEntity>> = { [TProp in Key<BaseEntity<TEntity>>]: BaseEntity<TEntity>[TProp] };

export type IEntityProperties<TEntity extends BaseEntity<TEntity>> = Omit<IEntityKeyValues<TEntity>, Key<IBaseEntityKeyValues<TEntity>>>;

export type IEntityNonTableColumnProperties = IEntityRelationshipPropertyTypes | ((...params: any) => any);

export type IEntityTableColumnProperties<TEntity extends BaseEntity<TEntity>> = FilterWhereNot<IEntityProperties<TEntity>, IEntityNonTableColumnProperties>;

export type IEntityTableColumnPropertiesOnly<TEntity extends BaseEntity<TEntity>, TProps extends Key<IEntityTableColumnProperties<TEntity>> = Key<IEntityTableColumnProperties<TEntity>>> = Pick<IEntityTableColumnProperties<TEntity>, TProps>;

export type IEntityTableColumnPropertiesExcept<TEntity extends BaseEntity<TEntity>, TProps extends Key<IEntityTableColumnProperties<TEntity>> = Key<IEntityTableColumnProperties<TEntity>>> = Omit<IEntityTableColumnProperties<TEntity>, TProps>;

export type IAvailableScopes = { [K in Key<typeof EntityScopeConst>]: ScopesOptions };

export type IEntityType<TEntity extends BaseEntity<TEntity> = BaseEntity> = Constructable<TEntity> & typeof BaseEntity<TEntity>;
