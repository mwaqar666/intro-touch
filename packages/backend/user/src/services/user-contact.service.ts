import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { NotFoundException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserContactEntity, UserEntity } from "@/backend/user/db/entities";
import { UserContactRepository, UserRepository } from "@/backend/user/db/repositories";
import type { CreateUserContactRequestDto } from "@/backend/user/dto/create-user-contact";

export class UserContactService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserContactRepository) private readonly userContactRepository: UserContactRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async createUserContact(userUuid: string, createUserContactRequestDto: CreateUserContactRequestDto): Promise<UserContactEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserContactEntity> => {
				const userEntity: Nullable<UserEntity> = await this.userRepository.findActiveUserByUuid(userUuid);

				if (!userEntity) throw new NotFoundException("User not found");

				const userContactTableColumnProperties: Partial<IEntityTableColumnProperties<UserContactEntity>> = {
					...createUserContactRequestDto,
					userContactUserId: userEntity.userId,
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
