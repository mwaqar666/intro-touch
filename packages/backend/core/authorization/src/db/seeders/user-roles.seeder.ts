import type { UserEntity } from "@/backend/user/db/entities";
import { UserRepository } from "@/backend/user/db/repositories";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { RoleEntity, UserRoleEntity } from "@/backend-core/authorization/db/entities";
import { RoleRepository, UserRoleRepository } from "@/backend-core/authorization/db/repositories";
import { RolesEnum } from "@/backend-core/authorization/enums";

export class UserRolesSeeder implements ISeeder {
	public timestamp = 1688976110323;

	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(RoleRepository) private readonly roleRepository: RoleRepository,
		@Inject(UserRoleRepository) private readonly userRoleRepository: UserRoleRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const users: Array<UserEntity> = await this.userRepository.findAll({
					findOptions: {},
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				const adminRole: Nullable<RoleEntity> = await this.roleRepository.findOne({
					findOptions: {
						where: { roleName: RolesEnum.Admin },
					},
					scopes: [EntityScopeConst.primaryKeyOnly],
				});

				if (!adminRole) return;

				const userRoleEntries: Array<Partial<IEntityTableColumnProperties<UserRoleEntity>>> = users.map((user: UserEntity): Partial<IEntityTableColumnProperties<UserRoleEntity>> => {
					return {
						userRoleUserId: user.userId,
						userRoleRoleId: adminRole.roleId,
					};
				});

				await this.userRoleRepository.createMany({
					valuesToCreate: userRoleEntries,
					transaction,
				});
			},
		});
	}
}
