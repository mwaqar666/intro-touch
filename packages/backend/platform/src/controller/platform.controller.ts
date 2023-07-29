import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformEntity } from "@/backend/platform/db/entities";
import type { UserOwnedPlatformsResponseDto } from "@/backend/platform/dto/user-owned";
import { PlatformService } from "@/backend/platform/services";

@Controller
export class PlatformController {
	public constructor(
		// Dependencies
		@Inject(PlatformService) private readonly platformService: PlatformService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getPlatformsByPlatformCategory(@Auth authEntity: UserEntity, @Path("platformCategoryUuid") platformCategoryUuid: string): Promise<{ platforms: Array<PlatformEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM]);

		return { platforms: await this.platformService.getPlatformsByPlatformCategory(platformCategoryUuid) };
	}

	public async getUserOwnedPlatforms(@Auth authEntity: UserEntity, @Path("userProfileUuid") userProfileUuid: string, @Path("platformCategoryUuid") platformCategoryUuid: string): Promise<UserOwnedPlatformsResponseDto> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM]);

		return await this.platformService.getUserOwnedPlatforms(userProfileUuid, platformCategoryUuid);
	}
}
