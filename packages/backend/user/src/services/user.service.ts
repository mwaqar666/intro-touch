import { HashService } from "@/backend-core/authentication/crypt";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import type { ResetPasswordRequestDto } from "@/backend/user/dto/reset-password";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(HashService) private readonly hashService: HashService,
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

  public async resetPassword(userEntity: UserEntity, resetPasswordRequestDto: ResetPasswordRequestDto): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserEntity> => {
				if (!userEntity.userPassword) throw new BadRequestException("Social login must set password first");

				const oldPasswordVerified: boolean = await this.hashService.compare(resetPasswordRequestDto.userOldPassword, userEntity.userPassword);

				if (!oldPasswordVerified) throw new BadRequestException("Invalid old password");

				const updatePasswordFields: Partial<IEntityTableColumnProperties<UserEntity>> = {
					userPassword: resetPasswordRequestDto.userPassword,
				};

				return this.userRepository.resetPassword(userEntity, updatePasswordFields, transaction);
			},
		});
	}

	public async fetchUser(userUuid: string): Promise<UserEntity> {
		return this.userRepository.fetchUser(userUuid);
	}
}
