import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { PermissionEntity } from "@/backend-core/authorization/db/entities";
import { PermissionRepository } from "@/backend-core/authorization/db/repositories";
import { Permission } from "@/backend-core/authorization/enums";

export class PermissionsSeeder implements ISeeder {
	public timestamp = 1688973720123;

	public constructor(
		// Dependencies

		@Inject(PermissionRepository) private readonly permissionRepository: PermissionRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const permissionNames: Array<Permission> = Object.values(Permission);

				const permissionEntries: Array<Partial<IEntityTableColumnProperties<PermissionEntity>>> = permissionNames.map((permissionName: Permission): Partial<IEntityTableColumnProperties<PermissionEntity>> => {
					return {
						permissionName,
					};
				});

				await this.permissionRepository.createMany({
					valuesToCreate: permissionEntries,
					transaction,
				});
			},
		});
	}
}
