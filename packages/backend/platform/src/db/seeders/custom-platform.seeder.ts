import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformCategoryEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository, PlatformCategoryRepository } from "@/backend/platform/db/repositories";

export class CustomPlatformSeeder {
	public timestamp = 1690207782282;

	public constructor(
		// Dependencies

		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		const categories: Array<string> = ["Get in touch", "Payment links", "Social links"];

		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const platformCategories: Array<PlatformCategoryEntity> = await this.platformCategoryRepository.findAll({ findOptions: {} });

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

				const nabeelBaigCustomPlatforms: Partial<IEntityTableColumnProperties<CustomPlatformEntity>>[] = platformCategories
					.filter((platformCategory: PlatformCategoryEntity): boolean => categories.includes(platformCategory.platformCategoryName))
					.map((platformCategory: PlatformCategoryEntity): Partial<IEntityTableColumnProperties<CustomPlatformEntity>> => {
						return {
							customPlatformUserProfileId: nabeelBaigDefaultProfile.userProfileId,
							customPlatformPlatformCategoryId: platformCategory.platformCategoryId,
							customPlatformName: "CUSTOM-XYZ",
							customPlatformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/google+map.png",
							customPlatformIdentity: "CustomNabeel-Identity",
						};
					});

				const muhammadWaqarCustomPlatforms: Partial<IEntityTableColumnProperties<CustomPlatformEntity>>[] = platformCategories
					.filter((platformCategory: PlatformCategoryEntity): boolean => categories.includes(platformCategory.platformCategoryName))
					.map((platformCategory: PlatformCategoryEntity): Partial<IEntityTableColumnProperties<CustomPlatformEntity>> => {
						return {
							customPlatformUserProfileId: muhammadWaqarDefaultProfile.userProfileId,
							customPlatformPlatformCategoryId: platformCategory.platformCategoryId,
							customPlatformName: "CUSTOM-XYZ",
							customPlatformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/google+map.png",
							customPlatformIdentity: "CustomNabeel-Identity",
						};
					});

				await this.customPlatformRepository.createMany({
					valuesToCreate: [...nabeelBaigCustomPlatforms, ...muhammadWaqarCustomPlatforms],
					transaction,
				});
			},
		});
	}
}
