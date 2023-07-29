import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository, PlatformRepository } from "@/backend/platform/db/repositories";
import type { UserOwnedPlatformsResponseDto } from "@/backend/platform/dto/user-owned";

export class PlatformService {
	public constructor(
		// Dependencies

		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
	) {}

	public getPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.platformRepository.getPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public async getUserOwnedPlatforms(userProfileUuid: string, platformCategoryUuid: string): Promise<UserOwnedPlatformsResponseDto> {
		const userOwnedBuiltinPlatforms: Array<PlatformEntity> = await this.platformRepository.getUserOwnedPlatforms(userProfileUuid, platformCategoryUuid);

		const userOwnedCustomPlatforms: Array<CustomPlatformEntity> = await this.customPlatformRepository.getUserOwnedCustomPlatforms(userProfileUuid, platformCategoryUuid);

		return {
			platforms: userOwnedBuiltinPlatforms,
			customPlatforms: userOwnedCustomPlatforms,
		};
	}
}
