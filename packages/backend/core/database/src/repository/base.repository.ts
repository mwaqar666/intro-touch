import { InternalServerException, NotFoundException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import type { CreationAttributes, WhereOptions } from "sequelize";
import { RepositoryConst } from "@/backend-core/database/const";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { CreateOrUpdateOptions, DeleteOptions, EntityKeyValues, EntityResolution, EntityScope, EntityType, FindOrCreateOptions, ICreateManyOptions, ICreateOneOptions, ScopedFinderOptions, UpdateOptions } from "@/backend-core/database/types";

export abstract class BaseRepository<TEntity extends BaseEntity<TEntity>> {
	protected constructor(protected readonly concreteEntity: EntityType<TEntity>) {}

	public async findOne(findOptions: ScopedFinderOptions<TEntity>): Promise<Nullable<TEntity>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteEntity.applyScopes<TEntity>(findOptions.scopes).findOne<TEntity>(findOptions.findOptions);
	}

	public async findOneOrFail(findOptions: ScopedFinderOptions<TEntity>): Promise<TEntity> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		const foundEntity: Nullable<TEntity> = await this.findOne(findOptions);

		if (foundEntity) return foundEntity;

		throw new NotFoundException(`${this.concreteEntity.name} with key value pairs ${JSON.stringify(findOptions.findOptions)} not found!`);
	}

	public async findAll(findOptions: ScopedFinderOptions<TEntity>): Promise<Array<TEntity>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteEntity.applyScopes<TEntity>(findOptions.scopes).findAll<TEntity>(findOptions.findOptions);
	}

	public async resolveOne(entity: EntityResolution<TEntity>, scopes?: EntityScope): Promise<Nullable<TEntity>> {
		if (typeof entity !== "string" && typeof entity !== "number") return entity;

		const scopedFindOptions: ScopedFinderOptions<TEntity> = this.providedOrDefaultScopedFindOptions({ scopes });

		if (typeof entity === "string") {
			if (!this.concreteEntity.uuidColumnName) throw new InternalServerException(`Uuid column name not defined on ${this.concreteEntity.name}`);

			scopedFindOptions.findOptions = { where: { [this.concreteEntity.uuidColumnName]: entity } as WhereOptions<TEntity> };
			return await this.findOne(scopedFindOptions);
		}

		scopedFindOptions.findOptions = { where: { [this.concreteEntity.primaryKeyAttribute]: entity } as WhereOptions<TEntity> };
		return await this.findOne(scopedFindOptions);
	}

	public async resolveOneOrFail(entity: EntityResolution<TEntity>, scopes?: EntityScope): Promise<TEntity> {
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

	public async update(updateOptions: UpdateOptions<TEntity>): Promise<TEntity> {
		const { scopes, transaction }: UpdateOptions<TEntity> = updateOptions;

		const foundEntity: TEntity =
			"findOptions" in updateOptions
				? await this.findOneOrFail({
						findOptions: updateOptions.findOptions,
						scopes,
				  })
				: await this.resolveOneOrFail(updateOptions.entity, scopes);

		return foundEntity.update(updateOptions.valuesToUpdate as EntityKeyValues<TEntity>, { transaction });
	}

	public async findOrCreate(findOrCreateOptions: FindOrCreateOptions<TEntity>): Promise<TEntity> {
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

	public async updateOrCreate(createOrUpdateOptions: CreateOrUpdateOptions<TEntity>): Promise<TEntity> {
		if ("entity" in createOrUpdateOptions && createOrUpdateOptions.entity) {
			const foundEntity: Nullable<TEntity> = await this.resolveOne(createOrUpdateOptions.entity, createOrUpdateOptions.scopes);

			if (foundEntity) return await foundEntity.update(createOrUpdateOptions.valuesToUpdate as EntityKeyValues<TEntity>, { transaction: createOrUpdateOptions.transaction });
		}

		if ("findOptions" in createOrUpdateOptions && createOrUpdateOptions.findOptions) {
			const foundEntity: Nullable<TEntity> = await this.findOne({
				findOptions: createOrUpdateOptions.findOptions,
				scopes: createOrUpdateOptions.scopes,
			});

			if (foundEntity) return await foundEntity.update(createOrUpdateOptions.valuesToUpdate as EntityKeyValues<TEntity>, { transaction: createOrUpdateOptions.transaction });
		}

		return await this.createOne({
			transaction: createOrUpdateOptions.transaction,
			valuesToCreate: { ...createOrUpdateOptions.valuesToCreate, ...createOrUpdateOptions.valuesToUpdate },
		});
	}

	public async delete(deleteOptions: DeleteOptions<TEntity>): Promise<boolean> {
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

	private providedOrDefaultScopedFindOptions(findOptions?: Partial<ScopedFinderOptions<TEntity>>): ScopedFinderOptions<TEntity> {
		const scopedEntityFindOptions: Partial<ScopedFinderOptions<TEntity>> = findOptions ?? RepositoryConst.DefaultScopedFindOptions;

		scopedEntityFindOptions.scopes = scopedEntityFindOptions.scopes ?? RepositoryConst.DefaultScopedFindOptions.scopes;
		scopedEntityFindOptions.findOptions = scopedEntityFindOptions.findOptions ?? RepositoryConst.DefaultScopedFindOptions.findOptions;

		return findOptions as ScopedFinderOptions<TEntity>;
	}
}
