import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { PermissionEntity, RoleEntity, RolePermissionEntity } from "@/backend-core/authorization/db/entities";
import { PermissionRepository, RolePermissionRepository, RoleRepository } from "@/backend-core/authorization/db/repositories";
import { PermissionsEnum } from "@/backend-core/authorization/enums";

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
					findOptions: { where: { roleName: "Admin" } },
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				if (admin) await this.seedAdminPermissions(admin);

				const customer: Nullable<RoleEntity> = await this.roleRepository.findOne({
					findOptions: { where: { roleName: "Customer" } },
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				if (customer) await this.seedCustomerPermissions(customer);
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

	private async seedCustomerPermissions(customerRole: RoleEntity): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const customerPermissions: Array<PermissionsEnum> = [
					PermissionsEnum.LIST_PLATFORM_CATEGORY,
					PermissionsEnum.VIEW_PLATFORM_CATEGORY,
					PermissionsEnum.LIST_PLATFORM,
					PermissionsEnum.VIEW_PLATFORM,
					PermissionsEnum.LIST_CUSTOM_PLATFORM,
					PermissionsEnum.VIEW_CUSTOM_PLATFORM,
					PermissionsEnum.CREATE_CUSTOM_PLATFORM,
					PermissionsEnum.UPDATE_CUSTOM_PLATFORM,
					PermissionsEnum.DELETE_CUSTOM_PLATFORM,
				];

				const permissions: Array<PermissionEntity> = await this.permissionRepository.findAll({
					findOptions: { where: { permissionName: customerPermissions } },
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				const rolePermissionEntries: Array<Partial<IEntityTableColumnProperties<RolePermissionEntity>>> = permissions.map((permission: PermissionEntity): Partial<IEntityTableColumnProperties<RolePermissionEntity>> => {
					return {
						rolePermissionRoleId: customerRole.roleId,
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
