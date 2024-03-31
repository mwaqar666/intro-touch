import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { IndustryEntity } from "@/backend/industry/db/entities";
import { IndustryRepository } from "@/backend/industry/db/repositories";

export class IndustriesSeeder implements ISeeder {
	public timestamp = 1688975570960;

	public constructor(
		// Dependencies

		@Inject(IndustryRepository) private readonly industryRepository: IndustryRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const industries: Array<string> = [
					"Technology",
					"Healthcare",
					"Education",
					"Finance",
					"Retail",
					"Manufacturing",
					"Automotive",
					"Entertainment",
					"Food & Beverage",
					"Travel & Tourism",
					"Real Estate",
					"Fashion & Apparel",
					"Energy & Utilities",
					"Construction",
					"Media & Communication",
					"Agriculture",
					"Transportation & Logistics",
					"Hospitality",
					"Legal Services",
					"Non-profit & Philanthropy",
				];

				const industriesToCreate: Array<Partial<IEntityTableColumnProperties<IndustryEntity>>> = industries.map((industry: string): Partial<IEntityTableColumnProperties<IndustryEntity>> => {
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
