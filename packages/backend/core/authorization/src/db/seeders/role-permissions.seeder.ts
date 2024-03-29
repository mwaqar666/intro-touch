import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { PermissionEntity, RoleEntity, RolePermissionEntity } from "@/backend-core/authorization/db/entities";
import { PermissionRepository, RolePermissionRepository, RoleRepository } from "@/backend-core/authorization/db/repositories";
import { Role } from "@/backend-core/authorization/enums";

export class RolePermissionsSeeder implements ISeeder {
	public timestamp = 1688974088333;

	public constructor(
		// Dependencies

		@Inject(RoleRepository) private readonly roleRepository: RoleRepository,
		@Inject(PermissionRepository) private readonly permissionRepository: PermissionRepository,
		@Inject(RolePermissionRepository) private readonly rolePermissionRepository: RolePermissionRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async (): Promise<void> => {
				const admin: Nullable<RoleEntity> = await this.roleRepository.findOne({
					findOptions: { where: { roleName: Role.Admin } },
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				if (admin) await this.seedAdminPermissions(admin);

				const customer: Nullable<RoleEntity> = await this.roleRepository.findOne({
					findOptions: { where: { roleName: Role.Customer } },
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				if (customer) await this.seedAdminPermissions(customer);
			},
		});
	}

	private async seedAdminPermissions(adminRole: RoleEntity): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const permissions: Array<PermissionEntity> = await this.permissionRepository.findAll({
					findOptions: {},
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				const rolePermissionEntries: Array<Partial<IEntityTableColumnProperties<RolePermissionEntity>>> = permissions.map((permission: PermissionEntity): Partial<IEntityTableColumnProperties<RolePermissionEntity>> => {
					return {
						rolePermissionRoleId: adminRole.roleId,
						rolePermissionPermissionId: permission.permissionId,
					};
				});

				await this.rolePermissionRepository.createMany({
					valuesToCreate: rolePermissionEntries,
					transaction,
				});
			},
		});
	}
}
