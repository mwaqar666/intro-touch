import type { FindOptions, Transaction } from "sequelize";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { EntityScope, EntityTableColumnProperties } from "@/backend-core/database/types/entity";

export type EntityResolution<TEntity extends BaseEntity<TEntity>> = TEntity | string | number;

export interface ITransactional {
	transaction: Transaction;
}

export interface IScoped {
	scopes: EntityScope;
}

export interface IFinderOptions<TEntity extends BaseEntity<TEntity>> {
	findOptions: FindOptions<TEntity>;
}

export type ScopedFinderOptions<TEntity extends BaseEntity<TEntity>> = Partial<IScoped> & IFinderOptions<TEntity>;

export interface IResolverOptions<TEntity extends BaseEntity<TEntity>> {
	entity: EntityResolution<TEntity>;
}

export type ScopedFinderOrResolverOption<TEntity extends BaseEntity<TEntity>> = Partial<IScoped> & (IFinderOptions<TEntity> | IResolverOptions<TEntity>);

export interface ICreateOneOptions<TEntity extends BaseEntity<TEntity>> extends ITransactional {
	valuesToCreate: Partial<EntityTableColumnProperties<TEntity>>;
}

export interface ICreateManyOptions<TEntity extends BaseEntity<TEntity>> extends ITransactional {
	valuesToCreate: Array<Partial<EntityTableColumnProperties<TEntity>>>;
}

export interface IUpdateBaseOptions<TEntity extends BaseEntity<TEntity>> extends ITransactional {
	valuesToUpdate: Partial<EntityTableColumnProperties<TEntity>>;
}

export interface IDeleteBaseOptions extends ITransactional {
	force?: boolean;
}

export type FindOrCreateOptions<TEntity extends BaseEntity<TEntity>> = Partial<ScopedFinderOrResolverOption<TEntity>> & ICreateOneOptions<TEntity>;

export type CreateOrUpdateOptions<TEntity extends BaseEntity<TEntity>> = Partial<ScopedFinderOrResolverOption<TEntity>> & IUpdateBaseOptions<TEntity> & ICreateOneOptions<TEntity>;

export type UpdateOptions<TEntity extends BaseEntity<TEntity>> = ScopedFinderOrResolverOption<TEntity> & IUpdateBaseOptions<TEntity>;

export type DeleteOptions<TEntity extends BaseEntity<TEntity>> = ScopedFinderOrResolverOption<TEntity> & IDeleteBaseOptions;
