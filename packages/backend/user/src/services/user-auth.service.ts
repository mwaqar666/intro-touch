import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import type { ICreateUserWithProfile } from "@/backend/user/types";

export class UserAuthService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public findActiveUserByEmail(userEmail: string): Promise<Nullable<UserEntity>> {
		return this.userRepository.findOne({
			findOptions: {
				where: { userEmail },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public findActiveUserByUuid(userUuid: string): Promise<Nullable<UserEntity>> {
		return this.userRepository.findOne({
			findOptions: {
				where: { userUuid },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public createNewUserWithProfile(userProperties: ICreateUserWithProfile): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<UserEntity> => {
				const user: UserEntity = await this.userRepository.createOne({
					valuesToCreate: {
						userEmail: userProperties.userEmail,
						userPicture: userProperties.userPicture,
						userFirstName: userProperties.userFirstName,
						userLastName: userProperties.userLastName,
						userPassword: userProperties.userPassword,
					},
					transaction: runningTransaction.transaction,
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
					transaction: runningTransaction.transaction,
				});

				return user;
			},
		});
	}
}
