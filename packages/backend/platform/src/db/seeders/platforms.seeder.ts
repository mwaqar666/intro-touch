import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";
import type { PlatformCategoryEntity, PlatformEntity } from "@/backend/platform/db/entities";
import { PlatformCategoryRepository, PlatformRepository } from "@/backend/platform/db/repositories";

interface IPlatform {
	platformName: string;
	platformIcon: string;
}

interface IPlatformCategory {
	platformCategoryName: string;
	platformCategoryPlatforms: Array<IPlatform>;
}

export class PlatformsSeeder implements ISeeder {
	public timestamp = 1689226980338;

	public constructor(
		// Dependencies
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		const platformCategorySeedData: Array<IPlatformCategory> = [
			{
				platformCategoryName: "Get in touch",
				platformCategoryPlatforms: [
					{
						platformName: "Call",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/phone.png",
					},
					{
						platformName: "Message",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/messages.png",
					},
					{
						platformName: "Calendly",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/calendly.png",
					},
					{
						platformName: "Maps",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/google+map.png",
					},
					{
						platformName: "Mail",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/apple_mail.png",
					},
					{
						platformName: "Behance",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/behance.png",
					},
					{
						platformName: "Contact",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/contact.png",
					},
					{
						platformName: "WhatsApp",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/whatsapp.png",
					},
				],
			},
			{
				platformCategoryName: "Payment links",
				platformCategoryPlatforms: [
					{
						platformName: "Venmo",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/venmo.png",
					},
					{
						platformName: "Paypal",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/paypal.png",
					},
					{
						platformName: "CashApp",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/cashapp.png",
					},
					{
						platformName: "ApplePay",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/applepay.png",
					},
				],
			},
			{
				platformCategoryName: "Social links",
				platformCategoryPlatforms: [
					{
						platformName: "Facebook",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/facebook.png",
					},
					{
						platformName: "Instagram",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/instagram.png",
					},
					{
						platformName: "LinkedIn",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/linkedin.png",
					},
					{
						platformName: "Twitter",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/twitter.png",
					},
					{
						platformName: "YouTube",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/youtube.png",
					},
					{
						platformName: "TikTok",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/tiktok.png",
					},
					{
						platformName: "SnapChat",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/snapchat.png",
					},
					{
						platformName: "Pinterest",
						platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/pinterest.png",
					},
				],
			},
		];

		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const platformCategories: Array<PlatformCategoryEntity> = await this.platformCategoryRepository.createMany({
					valuesToCreate: platformCategorySeedData.map(({ platformCategoryName }: IPlatformCategory): Partial<IEntityTableColumnProperties<PlatformCategoryEntity>> => {
						return { platformCategoryName };
					}),
					transaction,
				});

				const platformSeedData: Array<Partial<IEntityTableColumnProperties<PlatformEntity>>> = [];

				for (const platformCategory of platformCategories) {
					const platformCategorySeedDatum: Optional<IPlatformCategory> = platformCategorySeedData.find(({ platformCategoryName }: IPlatformCategory): boolean => {
						return platformCategoryName === platformCategory.platformCategoryName;
					});

					if (!platformCategorySeedDatum) continue;

					platformSeedData.push(
						...platformCategorySeedDatum.platformCategoryPlatforms.map(({ platformName, platformIcon }: IPlatform): Partial<IEntityTableColumnProperties<PlatformEntity>> => {
							return { platformPlatformCategoryId: platformCategory.platformCategoryId, platformName, platformIcon };
						}),
					);
				}

				await this.platformRepository.createMany({
					valuesToCreate: platformSeedData,
					transaction,
				});
			},
		});
	}
}
