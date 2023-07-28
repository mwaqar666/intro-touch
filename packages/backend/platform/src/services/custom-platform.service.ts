import { Inject } from "iocc";
import type { CustomPlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository } from "@/backend/platform/db/repositories";

export class CustomPlatformService {
	public constructor(
		// Dependencies

		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
	) {}

	public getCustomPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.customPlatformRepository.getCustomPlatformsByPlatformCategory(platformCategoryUuid);
	}
}
