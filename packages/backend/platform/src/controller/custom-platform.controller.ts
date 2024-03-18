import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { CustomPlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";
import { UpdateCustomPlatformRequestDto } from "@/backend/platform/dto/update-custom-platform";
import { CustomPlatformService } from "@/backend/platform/services";

@Controller
export class CustomPlatformController {
	public constructor(
		// Dependencies
		@Inject(CustomPlatformService) private readonly customPlatformService: CustomPlatformService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getCustomPlatformsByPlatformCategory(@Auth authEntity: UserEntity, @Path("platformCategoryUuid") platformCategoryUuid: string): Promise<{ customPlatforms: Array<CustomPlatformEntity> }> {
		await this.authorization.can(authEntity, [Permission.ListPlatform]);

		return { customPlatforms: await this.customPlatformService.getCustomPlatformsByPlatformCategory(platformCategoryUuid) };
	}

	public async updateCustomPlatform(
		@Auth authEntity: UserEntity,
		@Path("customPlatformUuid") customPlatformUuid: string,
		@Body(UpdateCustomPlatformRequestDto) updateCustomPlatformRequestDto: UpdateCustomPlatformRequestDto,
	): Promise<{ customPlatformEntity: CustomPlatformEntity }> {
		await this.authorization.can(authEntity, [Permission.UpdateCustomPlatform]);

		return { customPlatformEntity: await this.customPlatformService.updateCustomPlatform(customPlatformUuid, updateCustomPlatformRequestDto) };
	}

	public async createCustomPlatform(
		@Auth authEntity: UserEntity,
		@Path("userProfileUuid") userProfileUuid: string,
		@Path("platformUuid") platformUuid: string,
		@Body(CreateBuiltinPlatformRequestDto)
		createBuiltinPlatformRequestDto: CreateBuiltinPlatformRequestDto,
	): Promise<{ platformProfile: PlatformProfileEntity }> {
		await this.authorization.can(authEntity, [Permission.CreateUserProfile]);

		return { platformProfile: await this.customPlatformService.createCustomPlatform(userProfileUuid, platformUuid, createBuiltinPlatformRequestDto) };
	}
}
