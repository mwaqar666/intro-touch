import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreateBuiltinPlatformRequestDto, UpdateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";
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
		await this.authorization.can(authEntity, [Permission.UpdatePlatformProfile]);

		return { platformProfile: await this.platformProfileService.updateBuiltInPlatform(platformProfileUuid, updateBuiltinPlatformRequestDto) };
	}

	public async createBuiltInPlatform(
		@Auth authEntity: UserEntity,
		@Path("userProfileUuid") userProfileUuid: string,
		@Body(CreateBuiltinPlatformRequestDto)
		createBuiltinPlatformRequestDto: CreateBuiltinPlatformRequestDto,
	): Promise<{ platformProfile: PlatformProfileEntity }> {
		await this.authorization.can(authEntity, [Permission.CreateUserProfile]);

		const { platformUuid } = createBuiltinPlatformRequestDto;

		return { platformProfile: await this.platformProfileService.createBuiltInPlatform(userProfileUuid, platformUuid, createBuiltinPlatformRequestDto) };
	}

	public async deleteBuiltInPlatform(@Auth authEntity: UserEntity, @Path("platformProfileUuid") platformProfileUuid: string): Promise<{ platformProfile: boolean }> {
		await this.authorization.can(authEntity, [Permission.DeletePlatformProfile]);

		return { platformProfile: await this.platformProfileService.deleteBuiltInPlatform(platformProfileUuid) };
	}
}
