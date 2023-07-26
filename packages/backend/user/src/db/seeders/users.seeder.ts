import { HashService } from "@/backend-core/authentication/services";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";

export class UsersSeeder implements ISeeder {
	public timestamp = 1688975570959;

	public constructor(
		// Dependencies

		@Inject(HashService) private readonly hashService: HashService,
		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const hashedPassword: string = await this.hashService.hash("password");

				const users: Array<UserEntity> = await this.userRepository.createMany({
					valuesToCreate: [
						{
							userFirstName: "Muhammad",
							userLastName: "Waqar",
							userEmail: "muhammadwaqar666@gmail.com",
							userPassword: hashedPassword,
							userPicture: "",
						},
						{
							userFirstName: "Nabeel",
							userLastName: "Baig",
							userEmail: "mathswithnabeel@gmail.com",
							userPassword: hashedPassword,
							userPicture: "",
						},
					],
					transaction,
				});

				const userProfileEntries: Array<Partial<IEntityTableColumnProperties<UserProfileEntity>>> = users.map((user: UserEntity): Partial<IEntityTableColumnProperties<UserProfileEntity>> => {
					return {
						userProfileFirstName: user.userFirstName,
						userProfileLastName: user.userLastName,
						userProfileEmail: user.userEmail,
						userProfilePicture: user.userPicture,
						userProfileUserId: user.userId,
						userProfileIsLive: true,
					};
				});

				await this.userProfileRepository.createMany({
					valuesToCreate: userProfileEntries,
					transaction,
				});
			},
		});
	}
}
