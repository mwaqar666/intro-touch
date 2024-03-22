import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository, PlatformProfileRepository, PlatformRepository } from "@/backend/platform/db/repositories";
import type { CreatePlatformProfileRequestBodyDto, CreatePlatformProfileRequestPathDto } from "@/backend/platform/dto/create-platform-profile";
import type { UpdatePlatformProfileRequestDto } from "@/backend/platform/dto/update-platform-profile";
import type { UserOwnedPlatformRequestDto, UserOwnedPlatformResponseDto } from "@/backend/platform/dto/user-owned";

export class PlatformProfileService {
	public constructor(
		// Dependencies

		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(PlatformProfileRepository) private readonly platformProfileRepository: PlatformProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async getUserOwnedPlatforms({ userProfileUuid, platformCategoryUuid }: UserOwnedPlatformRequestDto): Promise<UserOwnedPlatformResponseDto> {
		const userOwnedBuiltinPlatforms: Array<PlatformEntity> = await this.platformRepository.getUserOwnedPlatforms(userProfileUuid, platformCategoryUuid);

		const userOwnedCustomPlatforms: Array<CustomPlatformEntity> = await this.customPlatformRepository.getUserOwnedCustomPlatforms(userProfileUuid, platformCategoryUuid);

		return {
			platforms: userOwnedBuiltinPlatforms,
			customPlatforms: userOwnedCustomPlatforms,
		};
	}

	public createPlatformProfile({ platformUuid, userProfileUuid }: CreatePlatformProfileRequestPathDto, createPlatformProfileRequestBodyDto: CreatePlatformProfileRequestBodyDto): Promise<PlatformProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<PlatformProfileEntity> => {
				const platform: PlatformEntity = await this.platformRepository.getPlatform(platformUuid);
				const userProfile: UserProfileEntity = await this.userProfileRepository.getUserProfile(userProfileUuid);

				const valuesToCreate: Partial<IEntityTableColumnProperties<PlatformProfileEntity>> = {
					platformProfileProfileId: userProfile.userProfileId,
					platformProfilePlatformId: platform.platformId,
					...createPlatformProfileRequestBodyDto,
				};

				return this.platformProfileRepository.createPlatformProfile(valuesToCreate, transaction);
			},
		});
	}

	public updatePlatformProfile(platformProfileUuid: string, updatePlatformProfileRequestDto: UpdatePlatformProfileRequestDto): Promise<PlatformProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: ({ transaction }: ITransactionStore): Promise<PlatformProfileEntity> => {
				return this.platformProfileRepository.updatePlatformProfile(platformProfileUuid, updatePlatformProfileRequestDto, transaction);
			},
		});
	}

	public deletePlatformProfile(platformProfileUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.platformProfileRepository.deletePlatformProfile(platformProfileUuid, transaction);
			},
		});
	}
}
