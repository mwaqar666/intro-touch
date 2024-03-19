import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import type { ResetPasswordRequestDto } from "@/backend/user/dto/reset-password";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async getUserWithLiveProfile(userEntity: string): Promise<UserEntity>;
	public async getUserWithLiveProfile(userEntity: UserEntity): Promise<UserEntity>;
	public async getUserWithLiveProfile(userEntity: string | UserEntity): Promise<UserEntity> {
		if (typeof userEntity === "string") {
			userEntity = await this.userRepository.findOrFailActiveUserByUsername(userEntity);
		}

		const userLiveProfile: UserProfileEntity = await this.userProfileRepository.getUserLiveProfile(userEntity);

		userEntity.setDataValue("userLiveUserProfile", userLiveProfile);

		return userEntity;
	}

	public async resetPassword(userId: number, resetPasswordRequestDto: ResetPasswordRequestDto): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<ResetPasswordRequestDto> => {
				return this.userRepository.resetPassword(userId, resetPasswordRequestDto, transaction);
			},
		});
	}

	public async fetchUser(userUuid: string): Promise<UserEntity> {
		return this.userRepository.fetchUser(userUuid);
	}
}
