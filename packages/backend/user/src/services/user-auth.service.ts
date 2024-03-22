import type { RoleEntity } from "@/backend-core/authorization/db/entities";
import { RoleRepository, UserRoleRepository } from "@/backend-core/authorization/db/repositories";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import type { IFindOrCreateUserProps } from "@/backend/user/types";

export class UserAuthService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(RoleRepository) private readonly roleRepository: RoleRepository,
		@Inject(UserRoleRepository) private readonly userRoleRepository: UserRoleRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public findActiveUserByEmail(userEmail: string): Promise<Nullable<UserEntity>> {
		return this.userRepository.findActiveUserByEmail(userEmail);
	}

	public findActiveUserByUuid(userUuid: string): Promise<Nullable<UserEntity>> {
		return this.userRepository.findActiveUserByUuid(userUuid);
	}

	public createNewUserWithProfile(userProperties: IFindOrCreateUserProps): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserEntity> => {
				const user: UserEntity = await this.userRepository.createOne({
					valuesToCreate: userProperties,
					transaction,
				});

				await this.userProfileRepository.createOne({
					valuesToCreate: {
						userProfileUserId: user.userId,
						userProfileEmail: userProperties.userEmail,
						userProfilePicture: userProperties.userPicture,
						userProfileFirstName: userProperties.userFirstName,
						userProfileLastName: userProperties.userLastName,
						userProfileIsLive: true,
					},
					transaction,
				});

				const admin: RoleEntity = await this.roleRepository.getAdminRole();

				await this.userRoleRepository.attachRoleToUser(user, admin, transaction);

				return user;
			},
		});
	}
}
