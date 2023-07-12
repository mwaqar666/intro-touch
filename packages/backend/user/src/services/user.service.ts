import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserRepository } from "@/backend/user/db/repositories";
import type { UpdateUserRequestDto } from "@/backend/user/dto/update-user";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public listUser(): Promise<Array<UserEntity>> {
		return this.userRepository.findAll({
			findOptions: {},
		});
	}

	public viewUser(userUuid: string): Promise<UserEntity> {
		return this.userRepository.findOneOrFail({
			findOptions: { where: { userUuid } },
		});
	}

	public async updateUser(userUuid: string, updateUserRequestDto: UpdateUserRequestDto): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserEntity> => {
				return this.userRepository.updateOne({
					findOptions: { where: { userUuid } },
					valuesToUpdate: updateUserRequestDto,
					transaction,
				});
			},
		});
	}

	public async deleteUser(userUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.userRepository.deleteOne({
					findOptions: { where: { userUuid } },
					transaction,
				});
			},
		});
	}
}
