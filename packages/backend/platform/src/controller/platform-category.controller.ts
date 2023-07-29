import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Controller } from "@/backend-core/request-processor/decorators";
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

	public async getPlatformCategories(@Auth authEntity: UserEntity): Promise<{ platformCategories: Array<PlatformCategoryEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM_CATEGORY]);

		return { platformCategories: await this.platformCategoryService.getPlatformCategories() };
	}
}
