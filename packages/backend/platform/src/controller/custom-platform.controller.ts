import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { CustomPlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformService } from "@/backend/platform/services";

export class CustomPlatformController {
	public constructor(
		// Dependencies
		@Inject(CustomPlatformService) private readonly customPlatformService: CustomPlatformService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getCustomPlatformsByPlatformCategory(@Auth authEntity: UserEntity, @Path("platformCategoryUuid") platformCategoryUuid: string): Promise<{ customPlatforms: Array<CustomPlatformEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM]);

		return { customPlatforms: await this.customPlatformService.getCustomPlatformsByPlatformCategory(platformCategoryUuid) };
	}
}
