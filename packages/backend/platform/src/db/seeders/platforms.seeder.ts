import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import { PlatformCategoryRepository, PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformsSeeder implements ISeeder {
	public timestamp = 1689226980338;

	public constructor(
		// Dependencies
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				await this.platformCategoryRepository.createMany({
					valuesToCreate: [{ platformCategoryName: "GET_IN_TOUCH" }, { platformCategoryName: "PAYMENT_LINKS" }, { platformCategoryName: "SOCIAL_LINKS" }],
					transaction,
				});

				await this.platformRepository.createMany({
					valuesToCreate: [
						{
							platformPlatformCategoryId: 1,
							platformName: "Call",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/phone.png",
						},
						{
							platformPlatformCategoryId: 1,
							platformName: "Message",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/messages.png",
						},
						{
							platformPlatformCategoryId: 1,
							platformName: "Calendly",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/calendly.png",
						},
						{
							platformPlatformCategoryId: 1,
							platformName: "Maps",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/google+map.png",
						},
						{
							platformPlatformCategoryId: 1,
							platformName: "Mail",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/apple_mail.png",
						},
						{
							platformPlatformCategoryId: 2,
							platformName: "Venmo",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/venmo.png",
						},
						{
							platformPlatformCategoryId: 2,
							platformName: "Paypal",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/paypal.png",
						},
						{
							platformPlatformCategoryId: 2,
							platformName: "CashApp",
							platformIcon: "https://intro-touch-attachment.s3.us-east-2.amazonaws.com/common/cashapp.png",
						},
					],
					transaction,
				});
			},
		});
	}
}
