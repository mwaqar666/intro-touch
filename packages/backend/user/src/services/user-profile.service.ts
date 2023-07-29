import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import type { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";

export class UserProfileService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public getUserProfiles(userProfileUserId: number): Promise<Array<UserProfileEntity>> {
		return this.userProfileRepository.getUserProfiles(userProfileUserId);
	}

	public getUserProfile(userProfileUuid: string): Promise<UserProfileEntity> {
		return this.userProfileRepository.getUserProfile(userProfileUuid);
	}

	public async updateUserProfile(userProfileUuid: string, updateUserProfileRequestDto: UpdateUserProfileRequestDto): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				return this.userProfileRepository.updateUserProfile(userProfileUuid, updateUserProfileRequestDto, { transaction });
			},
		});
	}
}
