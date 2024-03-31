import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Optional } from "@/stacks/types";
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
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const platforms: Array<PlatformEntity> = await this.getPlatforms();

				const userProfiles: Array<UserProfileEntity> = await this.getUserProfiles();

				const platformProfileData: Array<Partial<IEntityTableColumnProperties<PlatformProfileEntity>>> = [];

				for (const userProfile of userProfiles) {
					for (let platformProfileIndex: number = 0; platformProfileIndex < 3; platformProfileIndex++) {
						const platformIndex: number = Math.floor(Math.random() * platforms.length);

						const platform: Optional<PlatformEntity> = platforms[platformIndex];

						if (!platform) continue;

						platformProfileData.push(
							// Commented to format
							this.generatePlatformProfile(platformProfileIndex + 1, userProfile, platform),
						);
					}
				}

				await this.platformProfileRepository.createMany({
					valuesToCreate: platformProfileData,
					transaction,
				});
			},
		});
	}

	private getPlatforms(): Promise<Array<PlatformEntity>> {
		return this.platformRepository.findAll({
			findOptions: {},
		});
	}

	private getUserProfiles(): Promise<Array<UserProfileEntity>> {
		return this.userProfileRepository.findAll({
			findOptions: {},
		});
	}

	private generatePlatformProfile(platformProfileNumber: number, userProfile: UserProfileEntity, platform: PlatformEntity): Partial<IEntityTableColumnProperties<PlatformProfileEntity>> {
		const formattedPlatformProfileNumber: string = platformProfileNumber.toString().padStart(2, "0");

		return {
			platformProfileProfileId: userProfile.userProfileId,
			platformProfilePlatformId: platform.platformId,
			platformProfileIdentity: `@some_identity_${formattedPlatformProfileNumber}`,
		};
	}
}
