import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserRepository } from "@/backend/user/db/repositories";

export class UsersSeeder implements ISeeder {
	public timestamp = 1688975570959;

	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const userEntity: UserEntity = await this.userRepository.createOne({
					valuesToCreate: {
						userFirstName: "Muhammad",
						userLastName: "Waqar",
						userEmail: "muhammadwaqar666@gmail.com",
						userPassword: "password",
						userPicture: "",
					},
					transaction,
				});

				await this.userRepository.createOne({
					valuesToCreate: {
						userParentId: userEntity.userParentId,
						userFirstName: "Nabeel",
						userLastName: "Baig",
						userEmail: "mathswithnabeel@gmail.com",
						userPassword: "password",
						userPicture: "",
					},
					transaction,
				});
			},
		});
	}
}
