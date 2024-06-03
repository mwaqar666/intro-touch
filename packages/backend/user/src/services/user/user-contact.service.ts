import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import { Inject } from "iocc";
import type { UserContactEntity, UserEntity } from "@/backend/user/db/entities";
import { UserContactRepository, UserRepository } from "@/backend/user/db/repositories";
import type { CreateUserContactRequestDto } from "@/backend/user/dto/create-user-contact";

export class UserContactService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserContactRepository) private readonly userContactRepository: UserContactRepository,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async createUserContact(userUuid: string, createUserContactRequestDto: CreateUserContactRequestDto): Promise<UserContactEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserContactEntity> => {
				const userEntity: UserEntity = await this.userRepository.resolveOneOrFail(userUuid);

				const { userContactPicture, ...createUserContactFields }: CreateUserContactRequestDto = createUserContactRequestDto;

				const userContactTableColumnProperties: Partial<IEntityTableColumnProperties<UserContactEntity>> = {
					...createUserContactFields,
					userContactUserId: userEntity.userId,
				};

				if (userContactPicture) {
					const appConfig: IAppConfig = this.configResolver.resolveConfig("app");
					const userContactPictureBucketName: string = S3BucketConst.BucketName(appConfig.env, S3Bucket.ProfilePictures);

					userContactTableColumnProperties.userContactPicture = await this.storageService.storeFile(userContactPictureBucketName, userContactPicture);
				}

				return this.userContactRepository.createUserContact(userContactTableColumnProperties, transaction);
			},
		});
	}

	public getUserContacts(userEntity: UserEntity): Promise<Array<UserContactEntity>> {
		const userContactUserId: number = userEntity.userId;
		return this.userContactRepository.getUserContacts(userContactUserId);
	}
}
