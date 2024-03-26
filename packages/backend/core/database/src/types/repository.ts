import type { Filterable, FindOptions, Transaction } from "sequelize";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IEntityScope, IEntityTableColumnProperties } from "@/backend-core/database/types/entity";

export type IEntityResolution<TEntity extends BaseEntity<TEntity>> = TEntity | string | number;

export interface ITransactional {
	transaction: Transaction;
}

export interface IScoped {
	scopes: IEntityScope;
}

export interface IFindOptions<TEntity extends BaseEntity<TEntity>> {
	findOptions: FindOptions<TEntity>;
}

export type IScopedFinderOptions<TEntity extends BaseEntity<TEntity>> = Partial<IScoped> & IFindOptions<TEntity>;

export interface IResolverOptions<TEntity extends BaseEntity<TEntity>> {
	entity: IEntityResolution<TEntity>;
}

export type IScopedFinderOrResolverOption<TEntity extends BaseEntity<TEntity>> = Partial<IScoped> & (IFindOptions<TEntity> | IResolverOptions<TEntity>);

export interface ICreateOneOptions<TEntity extends BaseEntity<TEntity>> extends ITransactional {
	valuesToCreate: Partial<IEntityTableColumnProperties<TEntity>>;
}

export interface ICreateManyOptions<TEntity extends BaseEntity<TEntity>> extends ITransactional {
	valuesToCreate: Array<Partial<IEntityTableColumnProperties<TEntity>>>;
}

export interface IUpdateBaseOptions<TEntity extends BaseEntity<TEntity>> extends ITransactional {
	valuesToUpdate: Partial<IEntityTableColumnProperties<TEntity>>;
}

export interface IDeleteBaseOptions extends ITransactional {
	force?: boolean;
}

export type IFindOrCreateOptions<TEntity extends BaseEntity<TEntity>> = Partial<IScopedFinderOrResolverOption<TEntity>> & ICreateOneOptions<TEntity>;

export type ICreateOrUpdateOptions<TEntity extends BaseEntity<TEntity>> = Partial<IScopedFinderOrResolverOption<TEntity>> & IUpdateBaseOptions<TEntity> & ICreateOneOptions<TEntity>;

export type IUpdateOneOptions<TEntity extends BaseEntity<TEntity>> = IScopedFinderOrResolverOption<TEntity> & IUpdateBaseOptions<TEntity>;

export type IUpdateManyOptions<TEntity extends BaseEntity<TEntity>> = Partial<IScoped> & Required<Filterable<TEntity>> & IUpdateBaseOptions<TEntity>;

export type IDeleteOptions<TEntity extends BaseEntity<TEntity>> = IScopedFinderOrResolverOption<TEntity> & IDeleteBaseOptions;

export type IDeleteManyOptions<TEntity extends BaseEntity<TEntity>> = IScopedFinderOptions<TEntity> & IDeleteBaseOptions;
