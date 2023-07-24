import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { PlatformProfileRepository, PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformUserProfileSeeder implements ISeeder {
	public timestamp = 1690207782282;

	public constructor(
		// Dependencies

		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(PlatformProfileRepository) private readonly platformProfileRepository: PlatformProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		const nabeelBaigPlatformNames: Array<string> = ["Call", "Calendly", "Mail", "Paypal", "CashApp"];
		const muhammadWaqarPlatformNames: Array<string> = ["Message", "Calendly", "Maps", "Venmo", "Paypal"];

		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const platforms: Array<PlatformEntity> = await this.platformRepository.findAll({ findOptions: {} });

				const nabeelBaigDefaultProfile: UserProfileEntity = await this.userProfileRepository.findOneOrFail({
					findOptions: {
						where: {
							userProfileFirstName: "Nabeel",
							userProfileLastName: "Baig",
						},
					},
				});
				const muhammadWaqarDefaultProfile: UserProfileEntity = await this.userProfileRepository.findOneOrFail({
					findOptions: {
						where: {
							userProfileFirstName: "Muhammad",
							userProfileLastName: "Waqar",
						},
					},
				});

				const nabeelBaigPlatforms: Array<Partial<IEntityTableColumnProperties<PlatformProfileEntity>>> = platforms
					.filter((platform: PlatformEntity): boolean => nabeelBaigPlatformNames.includes(platform.platformName))
					.map((platform: PlatformEntity): Partial<IEntityTableColumnProperties<PlatformProfileEntity>> => {
						return {
							platformProfileProfileId: nabeelBaigDefaultProfile.userProfileId,
							platformProfilePlatformId: platform.platformId,
							platformProfileCustomPlatformId: null,
							platformProfileIdentity: "XYZ",
						};
					});

				const muhammadWaqarPlatforms: Array<Partial<IEntityTableColumnProperties<PlatformProfileEntity>>> = platforms
					.filter((platform: PlatformEntity): boolean => muhammadWaqarPlatformNames.includes(platform.platformName))
					.map((platform: PlatformEntity): Partial<IEntityTableColumnProperties<PlatformProfileEntity>> => {
						return {
							platformProfileProfileId: muhammadWaqarDefaultProfile.userProfileId,
							platformProfilePlatformId: platform.platformId,
							platformProfileCustomPlatformId: null,
							platformProfileIdentity: "XYZ",
						};
					});

				await this.platformProfileRepository.createMany({
					valuesToCreate: [...nabeelBaigPlatforms, ...muhammadWaqarPlatforms],
					transaction,
				});
			},
		});
	}
}
