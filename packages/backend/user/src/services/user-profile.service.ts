import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import type { CreateUserProfileRequestDto } from "@/backend/user/dto/create-user-profile";
import type { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";

export class UserProfileService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public getAuthUserProfileDropdown(authEntity: UserEntity): Promise<Array<UserProfileEntity>> {
		return this.userProfileRepository.getUserProfileDropdown(authEntity);
	}

	public getUserProfile(userProfileUuid: string): Promise<UserProfileEntity> {
		return this.userProfileRepository.getUserProfile(userProfileUuid);
	}

	public async createUserProfile(createUserProfileRequestDto: CreateUserProfileRequestDto): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				return this.userProfileRepository.createUserProfile(createUserProfileRequestDto, transaction);
			},
		});
	}

	public async updateUserProfile(userProfileUuid: string, updateUserProfileRequestDto: UpdateUserProfileRequestDto): Promise<UserProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserProfileEntity> => {
				return this.userProfileRepository.updateUserProfile(userProfileUuid, updateUserProfileRequestDto, transaction);
			},
		});
	}
}
