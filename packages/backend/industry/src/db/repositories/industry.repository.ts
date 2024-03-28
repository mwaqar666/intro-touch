import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { IndustryEntity } from "@/backend/industry/db/entities";

export class IndustryRepository extends BaseRepository<IndustryEntity> {
	public constructor() {
		super(IndustryEntity);
	}

	public getIndustryList(): Promise<Array<IndustryEntity>> {
		return this.findAll({
			findOptions: {},
			scopes: [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps],
		});
	}

	public getIndustry(industryUuid: string): Promise<IndustryEntity> {
		return this.resolveOneOrFail(industryUuid);
	}

	public createIndustry(valuesToCreate: Partial<IEntityTableColumnProperties<IndustryEntity>>, transaction: Transaction): Promise<IndustryEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}

	public updateIndustry(industryUuid: string, valuesToUpdate: Partial<IEntityTableColumnProperties<IndustryEntity>>, transaction: Transaction): Promise<IndustryEntity> {
		return this.updateOne({
			entity: industryUuid,
			valuesToUpdate,
			transaction,
		});
	}

	public deleteIndustry(industryUuid: string, transaction: Transaction): Promise<boolean> {
		return this.deleteOne({
			entity: industryUuid,
			transaction,
		});
	}
}
