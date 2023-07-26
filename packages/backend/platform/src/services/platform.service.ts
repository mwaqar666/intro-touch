import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformCategoryEntity, PlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository, PlatformCategoryRepository, PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformService {
	public constructor(
		// Dependencies

		@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository,
		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(PlatformCategoryRepository) private readonly platformCategoryRepository: PlatformCategoryRepository,
	) {}

	public getPlatformCategories(): Promise<Array<PlatformCategoryEntity>> {
		return this.platformCategoryRepository.getPlatformCategories();
	}

	public getPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<PlatformEntity>> {
		return this.platformRepository.getPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public getCustomPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.customPlatformRepository.getCustomPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public async getUserOwnedPlatforms(userProfileUuid: string): Promise<Array<PlatformCategoryEntity>> {
		const userOwnedBuiltinPlatforms: Array<PlatformCategoryEntity> = await this.platformCategoryRepository.getUserOwnedPlatforms(userProfileUuid);

		const userOwnedCustomPlatforms: Array<PlatformCategoryEntity> = await this.platformCategoryRepository.getUserOwnedCustomPlatforms(userProfileUuid);

		let userOwnedPlatforms: Array<PlatformCategoryEntity> = [];

		userOwnedBuiltinPlatforms.forEach((eachPlatformCategory: PlatformCategoryEntity): void => {
			userOwnedPlatforms = this.mergePlatformTypeInPlatformCategoryList(userOwnedPlatforms, eachPlatformCategory, "platformCategoryPlatforms");
		});

		userOwnedCustomPlatforms.forEach((eachPlatformCategory: PlatformCategoryEntity): void => {
			userOwnedPlatforms = this.mergePlatformTypeInPlatformCategoryList(userOwnedPlatforms, eachPlatformCategory, "platformCategoryCustomPlatforms");
		});

		return userOwnedPlatforms;
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
