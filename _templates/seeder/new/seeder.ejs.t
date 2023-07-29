---
to: packages/<%= seederPath %>/<%= name.replace(/\s/g, "-") %>.seeder.ts
---
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";

export class <%= h.changeCase.pascal(name) %>Seeder implements ISeeder {
	public timestamp = <%= Date.now() %>;

	public constructor(
		// Dependencies

		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				//
			},
		});
	}
}
