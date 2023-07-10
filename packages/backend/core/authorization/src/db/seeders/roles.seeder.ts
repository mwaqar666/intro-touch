import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import { RoleRepository } from "@/backend-core/authorization/db/repositories";

export class RolesSeeder implements ISeeder {
	public timestamp = 1688973343020;

	public constructor(
		// Dependencies

		@Inject(RoleRepository) private readonly roleRepository: RoleRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				await this.roleRepository.createMany({
					valuesToCreate: [
						{
							roleName: "Admin",
						},
						{
							roleName: "Customer",
						},
					],
					transaction,
				});
			},
		});
	}
}
