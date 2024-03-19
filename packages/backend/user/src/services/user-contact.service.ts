import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver } from "@/backend-core/config/types";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { StorageTokenConst } from "@/backend-core/storage/const";
import type { StorageService } from "@/backend-core/storage/services";
import { Inject } from "iocc";
import type { UserContactEntity, UserEntity } from "@/backend/user/db/entities";
import { UserContactRepository } from "@/backend/user/db/repositories";
import type { CreateUserContactRequestDto } from "@/backend/user/dto/create-user-contact";
import { UserService } from "@/backend/user/services/user.service";

export class UserContactService {
	public constructor(
		// Dependencies

		@Inject(UserContactRepository) private readonly userContactRepository: UserContactRepository,
		@Inject(StorageTokenConst.StorageServiceToken) private readonly storageService: StorageService,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
		@Inject(UserService) private readonly userService: UserService,
	) {}

	public async createUserContact(userUuid: string, createUserContactRequestDto: CreateUserContactRequestDto): Promise<UserContactEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserContactEntity> => {
				const userId: number = (await this.userService.fetchUser(userUuid)).userId;
				const userContactTableColumnProperties: Partial<IEntityTableColumnProperties<UserContactEntity>> = {
					...createUserContactRequestDto,
					userContactUserId: userId,
				};
				return this.userContactRepository.createUserContact(userContactTableColumnProperties, transaction);
			},
		});
	}

	public getUserContacts(userEntity: UserEntity): Promise<Array<UserContactEntity>> {
		const userContactUserId: number = userEntity.userId;
		return this.userContactRepository.getUserContacts(userContactUserId);
	}
}
