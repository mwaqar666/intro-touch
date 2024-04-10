import type { UserEntity } from "@/backend/user/db/entities";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { RoleEntity } from "@/backend-core/authorization/db/entities";
import { RoleRepository, UserRoleRepository } from "@/backend-core/authorization/db/repositories";
import type { Role } from "@/backend-core/authorization/enums";

export class RoleService {
	public constructor(
		// Dependencies

		@Inject(RoleRepository) private readonly roleRepository: RoleRepository,
		@Inject(UserRoleRepository) private readonly userRoleRepository: UserRoleRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public attachRoleToUser(user: UserEntity, role: Role): Promise<void> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const roleEntity: RoleEntity = await this.roleRepository.getRoleByRoleName(role);

				await this.userRoleRepository.attachRoleToUser(user, roleEntity, transaction);
			},
		});
	}
}
