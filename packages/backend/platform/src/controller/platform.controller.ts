import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformEntity } from "@/backend/platform/db/entities";
import { CreateBuiltinPlatformRequestDto } from "@/backend/platform/dto/create-builtin-platform";
import { UpdateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";
import { PlatformService } from "@/backend/platform/services";

@Controller
export class PlatformController {
	public constructor(
		// Dependencies
		@Inject(PlatformService) private readonly platformService: PlatformService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getPlatformList(@Auth userEntity: UserEntity, @Path("platformCategoryUuid") platformCategoryUuid: string): Promise<{ platforms: Array<PlatformEntity> }> {
		await this.authorization.can(userEntity, [Permission.ListPlatform]);

		return { platforms: await this.platformService.getPlatformList(platformCategoryUuid) };
	}

	public async getPlatform(@Auth userEntity: UserEntity, @Path("platformUuid") platformUuid: string): Promise<{ platform: PlatformEntity }> {
		await this.authorization.can(userEntity, [Permission.ViewPlatform]);

		return { platform: await this.platformService.getPlatform(platformUuid) };
	}

	public async createBuiltInPlatform(
		@Auth userEntity: UserEntity,
		@Path("platformCategoryUuid") platformCategoryUuid: string,
		@Body(CreateBuiltinPlatformRequestDto) createBuiltinPlatformRequestDto: CreateBuiltinPlatformRequestDto,
	): Promise<{ platform: PlatformEntity }> {
		await this.authorization.can(userEntity, [Permission.CreatePlatform]);

		return { platform: await this.platformService.createBuiltinPlatform(platformCategoryUuid, createBuiltinPlatformRequestDto) };
	}

	public async updateBuiltInPlatform(
		@Auth userEntity: UserEntity,
		@Path("platformUuid") platformUuid: string,
		@Body(UpdateBuiltinPlatformRequestDto) updateBuiltinPlatformRequestDto: UpdateBuiltinPlatformRequestDto,
	): Promise<{ platform: PlatformEntity }> {
		await this.authorization.can(userEntity, [Permission.UpdatePlatform]);

		return { platform: await this.platformService.updateBuiltinPlatform(platformUuid, updateBuiltinPlatformRequestDto) };
	}

	public async deleteBuiltInPlatform(@Auth userEntity: UserEntity, @Path("platformUuid") platformUuid: string): Promise<{ deleted: boolean }> {
		await this.authorization.can(userEntity, [Permission.DeletePlatform]);

		return { deleted: await this.platformService.deleteBuiltinPlatform(platformUuid) };
	}
}
