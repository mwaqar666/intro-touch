import { Role } from "@/backend-core/authorization/enums";
import { RoleService } from "@/backend-core/authorization/services";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityScope, IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import type { ShareUserAccountRequestDto } from "@/backend/user/dto/share-user-account";
import type { UpdateUserRequestDto } from "@/backend/user/dto/update-user/update-user-request.dto";
import { UserEmailService } from "@/backend/user/services/utils";
import type { IFindOrCreateUserProps } from "@/backend/user/types";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(RoleService) private readonly roleService: RoleService,
		@Inject(UserEmailService) private readonly userEmailService: UserEmailService,
		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public createNewUserWithProfile(userProperties: IFindOrCreateUserProps): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserEntity> => {
				const user: UserEntity = await this.userRepository.createUser(userProperties, transaction);

				const userProfileValuesToCreate: Partial<IEntityTableColumnProperties<UserProfileEntity>> = {
					userProfileUserId: user.userId,
					userProfileEmail: userProperties.userEmail,
					userProfilePicture: userProperties.userPicture,
					userProfileFirstName: userProperties.userFirstName,
					userProfileLastName: userProperties.userLastName,
					userProfileIsLive: true,
				};

				user.userLiveUserProfile = await this.userProfileRepository.createUserProfile(userProfileValuesToCreate, transaction);

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

	public async viewUser(userUuid: string): Promise<UserEntity> {
		return this.userRepository.getUser(userUuid, [EntityScopeConst.isActive, EntityScopeConst.withoutTimestamps]);
	}

	public async updateUser(userUuid: string, updateUserRequestDto: UpdateUserRequestDto): Promise<UserEntity> {
		return this.transactionManager.executeTransaction<UserEntity>({
			operation: async ({ transaction }: ITransactionStore): Promise<UserEntity> => {
				const applicationConfig: IAppConfig = this.configResolver.resolveConfig("app");
				const userPictureBucketName: string = S3BucketConst.BucketName(applicationConfig.env, S3Bucket.ProfilePictures);
				const userPicture: string = updateUserRequestDto.userPicture ? await this.storageService.storeFile(userPictureBucketName, updateUserRequestDto.userPicture) : "";

				const userValuesToUpdate: Partial<IEntityTableColumnProperties<UserEntity>> = {
					...updateUserRequestDto,
					userPicture,
				};

				return this.userRepository.updateUser(userUuid, userValuesToUpdate, transaction);
			},
		});
	}

	public async deleteUser(userUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction<boolean>({
			operation: async ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.userRepository.deleteUser(userUuid, transaction);
			},
		});
	}

	public async getUserList(): Promise<Array<UserEntity>> {
		return this.userRepository.getUserList();
	}

	public async shareUserAccount(userEntity: UserEntity, shareUserAccountRequestDto: ShareUserAccountRequestDto): Promise<boolean> {
		return this.userEmailService.sendAccountShareEmail(userEntity, shareUserAccountRequestDto.toEmail);
	}
}
