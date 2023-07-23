import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformCategoryEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { PlatformService } from "@/backend/platform/services";

@Controller
export class PlatformController {
	public constructor(
		// Dependencies
		@Inject(PlatformService) private readonly platformService: PlatformService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getPlatformCategories(@Auth authEntity: UserEntity): Promise<{ platformCategories: Array<PlatformCategoryEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM_CATEGORY]);

		return { platformCategories: await this.platformService.listPlatformCategories() };
	}

	public async getPlatforms(@Auth authEntity: UserEntity, @Path("platformCategoryUuid") platformCategoryUuid: string): Promise<{ platforms: Array<PlatformEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM]);

		return { platforms: await this.platformService.listPlatforms(platformCategoryUuid) };
	}

	public async getPlatformProfiles(@Auth authEntity: UserEntity): Promise<{ platformProfiles: Array<PlatformProfileEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM]);

		return { platformProfiles: await this.platformService.listPlatformProfiles() };
	}
}
