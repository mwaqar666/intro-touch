import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { IndustryEntity } from "@/backend/industry/db/entities";
import { IndustryRepository } from "@/backend/industry/db/repositories";
import { Industry } from "@/backend/industry/enums";

export class IndustriesSeeder implements ISeeder {
	public timestamp = 1711629923929;

	public constructor(
		// Dependencies

		@Inject(IndustryRepository) private readonly industryRepository: IndustryRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const industries: Array<Industry> = Object.values(Industry);

				const industriesToCreate: Array<Partial<IEntityTableColumnProperties<IndustryEntity>>> = industries.map((industry: Industry): Partial<IEntityTableColumnProperties<IndustryEntity>> => {
					return {
						industryName: industry,
					};
				});

				await this.industryRepository.createMany({
					valuesToCreate: industriesToCreate,
					transaction,
				});
			},
		});
	}
}
