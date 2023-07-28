import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository, PlatformCategoryRepository, PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformService {
	public constructor(
		// Dependencies

		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
	) {}

	public getPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.platformRepository.getPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public async getUserOwnedPlatforms(userProfileUuid: string, platformCategoryUuid: string): Promise<{ platforms: PlatformEntity; customPlatforms: CustomPlatformEntity }> {
		// const userOwnedBuiltinPlatforms: Array<PlatformCategoryEntity> = await this.platformCategoryRepository.getUserOwnedPlatforms(userProfileUuid);
		// const userOwnedCustomPlatforms: Array<PlatformCategoryEntity> = await this.platformCategoryRepository.getUserOwnedCustomPlatforms(userProfileUuid);

		const userOwnedBuiltinPlatforms: Array<PlatformEntity> = await this.platformRepository.getUserOwnedPlatforms(userProfileUuid, platformCategoryUuid);

		const userOwnedCustomPlatforms: Array<CustomPlatformEntity> = await this.customPlatformRepository.getUserOwnedCustomPlatforms(userProfileUuid, platformCategoryUuid);

		/*let userOwnedPlatforms: Array<any> = [];

        userOwnedBuiltinPlatforms.forEach((eachPlatformCategory: PlatformEntity): void => {
            userOwnedPlatforms = this.mergePlatformTypeInPlatformCategoryList(userOwnedPlatforms, eachPlatformCategory, "platformCategoryPlatforms");
        });

        userOwnedCustomPlatforms.forEach((eachPlatformCategory: CustomPlatformEntity): void => {
            userOwnedPlatforms = this.mergePlatformTypeInPlatformCategoryList(userOwnedPlatforms, eachPlatformCategory, "platformCategoryCustomPlatforms");
        });*/
		return {
			platforms: userOwnedBuiltinPlatforms,
			customPlatforms: userOwnedCustomPlatforms,
		};
	}

	private mergePlatformTypeInPlatformCategoryList<T extends "platformCategoryPlatforms" | "platformCategoryCustomPlatforms">(
		platformCategoryList: Array<PlatformCategoryEntity>,
		platformCategoryToMerge: PlatformCategoryEntity,
		platformTypeToMerge: T,
	): Array<PlatformCategoryEntity> {
		const platformCategoryIndex: number = platformCategoryList.findIndex((platformCategory: PlatformCategoryEntity): boolean => {
			return platformCategory.platformCategoryId === platformCategoryToMerge.platformCategoryId;
		});

		if (platformCategoryIndex === -1) return platformCategoryList.concat(platformCategoryToMerge);

		const platformCategory: Optional<PlatformCategoryEntity> = platformCategoryList[platformCategoryIndex];
		if (!platformCategory) return platformCategoryList;

		platformCategory.setDataValue(platformTypeToMerge, platformCategoryToMerge[platformTypeToMerge]);
		platformCategoryList[platformCategoryIndex] = platformCategory;

		return platformCategoryList;
	}
}
