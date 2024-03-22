import { Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformCategoryEntity } from "@/backend/platform/db/entities";
import { PlatformCategoryService } from "@/backend/platform/services";

@Controller
export class PlatformCategoryController {
	public constructor(
		// Dependencies
		@Inject(PlatformCategoryService) private readonly platformCategoryService: PlatformCategoryService,
	) {}

	public async getPlatformCategoryList(): Promise<{ platformCategories: Array<PlatformCategoryEntity> }> {
		return { platformCategories: await this.platformCategoryService.getPlatformCategories() };
	}

	public async getPlatformCategory(@Path("platformCategoryUuid") platformCategoryUuid: string): Promise<{ platformCategory: PlatformCategoryEntity }> {
		return { platformCategory: await this.platformCategoryService.getPlatformCategory(platformCategoryUuid) };
	}
}
