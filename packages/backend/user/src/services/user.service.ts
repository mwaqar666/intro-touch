import { HashService } from "@/backend-core/authentication/services/crypt";
import { Role } from "@/backend-core/authorization/enums";
import { RoleService } from "@/backend-core/authorization/services";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityScope, IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import type { ChangePasswordRequestDto } from "@/backend/user/dto/change-password";
import type { IFindOrCreateUserProps } from "@/backend/user/types";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(HashService) private readonly hashService: HashService,
		@Inject(RoleService) private readonly roleService: RoleService,
		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

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

				await this.roleService.attachRoleToUser(user, Role.Admin);

				return user;
			},
		});
	}

	public async getUserWithLiveProfile(userUsername: string): Promise<UserEntity> {
		const userEntity: UserEntity = await this.userRepository.findOrFailActiveUserByUsername(userUsername, [EntityScopeConst.withoutTimestamps]);

		const industryScopes: IEntityScope = [{ method: [EntityScopeConst.withColumns, "industryName"] }];
		const userProfileScopes: IEntityScope = [EntityScopeConst.withoutTimestamps];
		const userLiveProfile: UserProfileEntity = await this.userProfileRepository.getUserLiveProfile(userEntity, userProfileScopes, industryScopes);

		userEntity.setDataValue("userLiveUserProfile", userLiveProfile);

		return userEntity;
	}

	public async getUserList(): Promise<Array<UserEntity>> {
		return this.userRepository.getUserList();
	}

	public async resetPassword(userEntity: UserEntity, changePasswordRequestDto: ChangePasswordRequestDto): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserEntity> => {
				if (!userEntity.userPassword) throw new BadRequestException("Social login must set password first");

				const oldPasswordVerified: boolean = await this.hashService.compare(changePasswordRequestDto.userOldPassword, userEntity.userPassword);

				if (!oldPasswordVerified) throw new BadRequestException("Invalid old password");

				const updatePasswordFields: Partial<IEntityTableColumnProperties<UserEntity>> = {
					userPassword: changePasswordRequestDto.userPassword,
				};

				return this.userRepository.resetPassword(userEntity, updatePasswordFields, transaction);
			},
		});
	}
}
