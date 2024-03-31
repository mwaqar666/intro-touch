import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityScope, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { IndustryEntity } from "@/backend/industry/db/entities";
import { IndustryRepository } from "@/backend/industry/db/repositories";
import type { CreateIndustryRequestDto } from "@/backend/industry/dto/create-industry";
import type { UpdateIndustryRequestDto } from "@/backend/industry/dto/update-industry";

export class IndustryService {
	public constructor(
		// Dependencies

		@Inject(IndustryRepository) private readonly industryRepository: IndustryRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public getIndustryList(): Promise<Array<IndustryEntity>> {
		const scopes: IEntityScope = [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps];

		return this.industryRepository.getIndustryList(scopes);
	}

	public getIndustry(industryUuid: string): Promise<IndustryEntity> {
		const scopes: IEntityScope = [EntityScopeConst.withoutTimestamps];

		return this.industryRepository.getIndustry(industryUuid, scopes);
	}

	public createIndustry(createIndustryRequestDto: CreateIndustryRequestDto): Promise<IndustryEntity> {
		return this.transactionManager.executeTransaction({
			operation: ({ transaction }: ITransactionStore): Promise<IndustryEntity> => {
				return this.industryRepository.createIndustry(createIndustryRequestDto, transaction);
			},
		});
	}

	public updateIndustry(industryUuid: string, updateIndustryRequestDto: UpdateIndustryRequestDto): Promise<IndustryEntity> {
		return this.transactionManager.executeTransaction({
			operation: ({ transaction }: ITransactionStore): Promise<IndustryEntity> => {
				return this.industryRepository.updateIndustry(industryUuid, updateIndustryRequestDto, transaction);
			},
		});
	}

	public deleteIndustry(industryUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.industryRepository.deleteIndustry(industryUuid, transaction);
			},
		});
	}
}
