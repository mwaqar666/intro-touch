import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { UpdateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";
import { PlatformProfileService } from "@/backend/platform/services";

@Controller
export class PlatformProfileController {
	public constructor(
		// Dependencies
		@Inject(PlatformProfileService) private readonly platformProfileService: PlatformProfileService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async updateBuiltInPlatform(
		@Auth authEntity: UserEntity,
		@Path("platformProfileUuid") platformProfileUuid: string,
		@Body(UpdateBuiltinPlatformRequestDto) updateBuiltinPlatformRequestDto: UpdateBuiltinPlatformRequestDto,
	): Promise<{ platformProfile: PlatformProfileEntity }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_PLATFORM]);

		return { platformProfile: await this.platformProfileService.updateBuiltInPlatform(platformProfileUuid, updateBuiltinPlatformRequestDto) };
	}
}
