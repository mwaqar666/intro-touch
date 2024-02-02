import { InternalServerException, NotFoundException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import type { CreationAttributes, WhereOptions } from "sequelize";
import { RepositoryConst } from "@/backend-core/database/const";
import type { BaseEntity } from "@/backend-core/database/entity";
import type {
	ICreateManyOptions,
	ICreateOneOptions,
	ICreateOrUpdateOptions,
	IDeleteManyOptions,
	IDeleteOptions,
	IEntityKeyValues,
	IEntityResolution,
	IEntityScope,
	IEntityType,
	IFindOrCreateOptions,
	IScopedFinderOptions,
	IUpdateOptions,
} from "@/backend-core/database/types";

export abstract class BaseRepository<TEntity extends BaseEntity<TEntity>> {
	protected constructor(protected readonly concreteEntity: IEntityType<TEntity>) {}

	public async findOne(findOptions: IScopedFinderOptions<TEntity>): Promise<Nullable<TEntity>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteEntity.applyScopes<TEntity>(findOptions.scopes).findOne<TEntity>(findOptions.findOptions);
	}

	public async findOneOrFail(findOptions: IScopedFinderOptions<TEntity>): Promise<TEntity> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		const foundEntity: Nullable<TEntity> = await this.findOne(findOptions);

		if (foundEntity) return foundEntity;

		throw new NotFoundException(`${this.concreteEntity.name} with key value pairs ${JSON.stringify(findOptions.findOptions)} not found!`);
	}

	public async findAll(findOptions: IScopedFinderOptions<TEntity>): Promise<Array<TEntity>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteEntity.applyScopes<TEntity>(findOptions.scopes).findAll<TEntity>(findOptions.findOptions);
	}

	public async count(findOptions: IScopedFinderOptions<TEntity>): Promise<number> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteEntity.applyScopes<TEntity>(findOptions.scopes).count(findOptions.findOptions);
	}

	public async resolveOne(entity: IEntityResolution<TEntity>, scopes?: IEntityScope): Promise<Nullable<TEntity>> {
		if (typeof entity !== "string" && typeof entity !== "number") return entity;

		const scopedFindOptions: IScopedFinderOptions<TEntity> = this.providedOrDefaultScopedFindOptions({ scopes });

		if (typeof entity === "string") {
			if (!this.concreteEntity.uuidColumnName) throw new InternalServerException(`Uuid column name not defined on ${this.concreteEntity.name}`);

			scopedFindOptions.findOptions = { where: { [this.concreteEntity.uuidColumnName]: entity } as WhereOptions<TEntity> };
			return await this.findOne(scopedFindOptions);
		}

		scopedFindOptions.findOptions = { where: { [this.concreteEntity.primaryKeyAttribute]: entity } as WhereOptions<TEntity> };

		return await this.findOne(scopedFindOptions);
	}

	public async resolveOneOrFail(entity: IEntityResolution<TEntity>, scopes?: IEntityScope): Promise<TEntity> {
		const foundEntity: Nullable<TEntity> = await this.resolveOne(entity, scopes);

		if (foundEntity) return foundEntity;

		throw new NotFoundException(`${this.concreteEntity.name} not resolved with identifier ${entity}`);
	}

	public async createOne(createOptions: ICreateOneOptions<TEntity>): Promise<TEntity> {
		const { valuesToCreate, transaction }: ICreateOneOptions<TEntity> = createOptions;

		return await this.concreteEntity.create<TEntity>(valuesToCreate as CreationAttributes<TEntity>, { transaction });
	}

	public async createMany(createOptions: ICreateManyOptions<TEntity>): Promise<Array<TEntity>> {
		const { valuesToCreate, transaction }: ICreateManyOptions<TEntity> = createOptions;

		return await this.concreteEntity.bulkCreate<TEntity>(valuesToCreate as Array<CreationAttributes<TEntity>>, { transaction });
	}

	public async updateOne(updateOptions: IUpdateOptions<TEntity>): Promise<TEntity> {
		const { scopes, transaction }: IUpdateOptions<TEntity> = updateOptions;

		const foundEntity: TEntity =
			"findOptions" in updateOptions
				? // Find by finder options
					await this.findOneOrFail({ findOptions: updateOptions.findOptions, scopes })
				: // Or resolve using primary key or uuid
					await this.resolveOneOrFail(updateOptions.entity, scopes);

		return foundEntity.update(updateOptions.valuesToUpdate as IEntityKeyValues<TEntity>, { transaction });
	}

	public async findOrCreate(findOrCreateOptions: IFindOrCreateOptions<TEntity>): Promise<TEntity> {
		if ("entity" in findOrCreateOptions && findOrCreateOptions.entity) {
			const foundEntity: Nullable<TEntity> = await this.resolveOne(findOrCreateOptions.entity, findOrCreateOptions.scopes);

			if (foundEntity) return foundEntity;
		}

		if ("findOptions" in findOrCreateOptions && findOrCreateOptions.findOptions) {
			const foundEntity: Nullable<TEntity> = await this.findOne({
				findOptions: findOrCreateOptions.findOptions,
				scopes: findOrCreateOptions.scopes,
			});

			if (foundEntity) return foundEntity;
		}

		return await this.createOne({
			transaction: findOrCreateOptions.transaction,
			valuesToCreate: findOrCreateOptions.valuesToCreate,
		});
	}

	public async updateOrCreate(createOrUpdateOptions: ICreateOrUpdateOptions<TEntity>): Promise<TEntity> {
		if ("entity" in createOrUpdateOptions && createOrUpdateOptions.entity) {
			const foundEntity: Nullable<TEntity> = await this.resolveOne(createOrUpdateOptions.entity, createOrUpdateOptions.scopes);

			if (foundEntity) return await foundEntity.update(createOrUpdateOptions.valuesToUpdate as IEntityKeyValues<TEntity>, { transaction: createOrUpdateOptions.transaction });
		}

		if ("findOptions" in createOrUpdateOptions && createOrUpdateOptions.findOptions) {
			const foundEntity: Nullable<TEntity> = await this.findOne({
				findOptions: createOrUpdateOptions.findOptions,
				scopes: createOrUpdateOptions.scopes,
			});

			if (foundEntity) return await foundEntity.update(createOrUpdateOptions.valuesToUpdate as IEntityKeyValues<TEntity>, { transaction: createOrUpdateOptions.transaction });
		}

		return await this.createOne({
			transaction: createOrUpdateOptions.transaction,
			valuesToCreate: { ...createOrUpdateOptions.valuesToCreate, ...createOrUpdateOptions.valuesToUpdate },
		});
	}

	public async deleteOne(deleteOptions: IDeleteOptions<TEntity>): Promise<boolean> {
		if ("findOptions" in deleteOptions) {
			const foundEntity: Nullable<TEntity> = await this.findOne({
				findOptions: deleteOptions.findOptions,
				scopes: deleteOptions.scopes,
			});
			if (!foundEntity) return false;

			await foundEntity.destroy({
				transaction: deleteOptions.transaction,
				force: deleteOptions.force ?? false,
			});
			return true;
		}

		const foundEntity: Nullable<TEntity> = await this.resolveOne(deleteOptions.entity, deleteOptions.scopes);
		if (!foundEntity) return false;

		await foundEntity.destroy({
			transaction: deleteOptions.transaction,
			force: deleteOptions.force ?? false,
		});
		return true;
	}

	public async deleteMany(deleteOptions: IDeleteManyOptions<TEntity>): Promise<boolean> {
		const deletedEntityCount: number = await this.concreteEntity.destroy({
			where: deleteOptions.findOptions.where,
			transaction: deleteOptions.transaction,
			force: deleteOptions.force ?? false,
		});

		return deletedEntityCount > 0;
	}

	private providedOrDefaultScopedFindOptions(findOptions?: Partial<IScopedFinderOptions<TEntity>>): Required<IScopedFinderOptions<TEntity>> {
		return {
			...RepositoryConst.DefaultScopedFindOptions,
			...findOptions,
		};
	}
}
