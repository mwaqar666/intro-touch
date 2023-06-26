import type { IAuthEntityLookUpRequest, IAuthEntityLookUpResponse } from "@/backend-core/authentication/types";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";

export class UserAuthService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async authenticateUser(lookUpRequest: IAuthEntityLookUpRequest): Promise<IAuthEntityLookUpResponse> {
		let user: Nullable<UserEntity> = await this.findActiveUserByEmail(lookUpRequest.userEmail);
		if (user) return { entity: user, created: false };

		user = await this.createNewUserWithProfile(lookUpRequest);
		return { entity: user, created: true };
	}

	public findActiveUserByUuid(userUuid: string): Promise<Nullable<UserEntity>> {
		return this.userRepository.findOne({
			findOptions: {
				where: { userUuid },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	private findActiveUserByEmail(userEmail: string): Promise<Nullable<UserEntity>> {
		return this.userRepository.findOne({
			findOptions: {
				where: { userEmail },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	private createNewUserWithProfile(lookUpRequest: IAuthEntityLookUpRequest): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async (runningTransaction: ITransactionStore): Promise<UserEntity> => {
				const user: UserEntity = await this.userRepository.createOne({
					valuesToCreate: {
						userEmail: lookUpRequest.userEmail,
						userPicture: "",
						userFirstName: lookUpRequest.userFirstName ?? "",
						userLastName: lookUpRequest.userLastName ?? "",
					},
					transaction: runningTransaction.transaction,
				});

				await this.userProfileRepository.createOne({
					valuesToCreate: {
						userProfileUserId: user.userId,
						userProfileEmail: lookUpRequest.userEmail,
						userProfilePicture: "",
						userProfileFirstName: lookUpRequest.userFirstName ?? "",
						userProfileLastName: lookUpRequest.userLastName ?? "",
						userProfileIsLive: true,
					},
					transaction: runningTransaction.transaction,
				});

				return user;
			},
		});
	}
}
