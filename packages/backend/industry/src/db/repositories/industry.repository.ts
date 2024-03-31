import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityScope, IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import type { Transaction } from "sequelize";
import { IndustryEntity } from "@/backend/industry/db/entities";

export class IndustryRepository extends BaseRepository<IndustryEntity> {
	public constructor() {
		super(IndustryEntity);
	}

	public getIndustryList(scopes: IEntityScope): Promise<Array<IndustryEntity>> {
		return this.findAll({
			findOptions: {},
			scopes,
		});
	}

	public getIndustry(industryUuid: string, scopes: IEntityScope): Promise<IndustryEntity> {
		return this.resolveOneOrFail(industryUuid, scopes);
	}

	public getIndustryOrNull(industryUuid: string, scopes: IEntityScope): Promise<Nullable<IndustryEntity>> {
		return this.resolveOne(industryUuid, scopes);
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
