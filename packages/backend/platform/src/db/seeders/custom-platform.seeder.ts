import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Optional } from "@/stacks/types";
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
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const platformCategories: Array<PlatformCategoryEntity> = await this.getPlatformCategories();

				const userProfiles: Array<UserProfileEntity> = await this.getUserProfiles();

				const customPlatformData: Array<Partial<IEntityTableColumnProperties<CustomPlatformEntity>>> = [];

				for (const userProfile of userProfiles) {
					const numberOfCustomPlatforms: number = Math.floor(Math.random() * 10);

					for (let customPlatformIndex: number = 0; customPlatformIndex < numberOfCustomPlatforms; customPlatformIndex++) {
						const platformCategoryIndex: number = Math.floor(Math.random() * platformCategories.length);

						const platformCategory: Optional<PlatformCategoryEntity> = platformCategories[platformCategoryIndex];

						if (!platformCategory) continue;

						customPlatformData.push(
							// Commented to format
							this.generateCustomPlatform(customPlatformIndex + 1, userProfile, platformCategory),
						);
					}
				}

				await this.customPlatformRepository.createMany({
					valuesToCreate: customPlatformData,
					transaction,
				});
			},
		});
	}

	private getPlatformCategories(): Promise<Array<PlatformCategoryEntity>> {
		return this.platformCategoryRepository.findAll({
			findOptions: {},
		});
	}

	private getUserProfiles(): Promise<Array<UserProfileEntity>> {
		return this.userProfileRepository.findAll({
			findOptions: {},
		});
	}

	private generateCustomPlatform(customPlatformNumber: number, userProfile: UserProfileEntity, platformCategory: PlatformCategoryEntity): Partial<IEntityTableColumnProperties<CustomPlatformEntity>> {
		const formattedCustomPlatformNumber: string = customPlatformNumber.toString().padStart(2, "0");

		return {
			customPlatformUserProfileId: userProfile.userProfileId,
			customPlatformPlatformCategoryId: platformCategory.platformCategoryId,
			customPlatformName: `Social Media - ${formattedCustomPlatformNumber}`,
			customPlatformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/google+map.png",
			customPlatformIdentity: `@custom_identity_${formattedCustomPlatformNumber}`,
		};
	}
}
