import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformCategoryEntity } from "@/backend/platform/db/entities";
import { PlatformCategoryService } from "@/backend/platform/services";

@Controller
export class PlatformCategoryController {
	public constructor(
		// Dependencies
		@Inject(PlatformCategoryService) private readonly platformCategoryService: PlatformCategoryService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getPlatformCategories(): Promise<{ platformCategories: Array<PlatformCategoryEntity> }> {
		return { platformCategories: await this.platformCategoryService.getPlatformCategories() };
	}
}
