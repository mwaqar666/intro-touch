import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { CustomPlatformEntity } from "@/backend/platform/db/entities";
import { CreateCustomPlatformRequestBodyDto, CreateCustomPlatformRequestPathDto } from "@/backend/platform/dto/create-custom-platform";
import { ListCustomPlatformRequestDto } from "@/backend/platform/dto/list-custom-platform";
import { UpdateCustomPlatformRequestDto } from "@/backend/platform/dto/update-custom-platform";
import { CustomPlatformService } from "@/backend/platform/services";

@Controller
export class CustomPlatformController {
	public constructor(
		// Dependencies
		@Inject(CustomPlatformService) private readonly customPlatformService: CustomPlatformService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getCustomPlatformList(@Auth userEntity: UserEntity, @Path(ListCustomPlatformRequestDto) listCustomPlatformRequestDto: ListCustomPlatformRequestDto): Promise<{ customPlatforms: Array<CustomPlatformEntity> }> {
		await this.authorization.can(userEntity, [Permission.ListCustomPlatform]);

		return { customPlatforms: await this.customPlatformService.getCustomPlatformList(listCustomPlatformRequestDto) };
	}

	public async getCustomPlatform(@Auth userEntity: UserEntity, @Path("customPlatformUuid") customPlatformUuid: string): Promise<{ customPlatform: CustomPlatformEntity }> {
		await this.authorization.can(userEntity, [Permission.ViewCustomPlatform]);

		return { customPlatform: await this.customPlatformService.getCustomPlatform(customPlatformUuid) };
	}

	public async createCustomPlatform(
		@Auth userEntity: UserEntity,
		@Path(CreateCustomPlatformRequestPathDto) createCustomPlatformRequestPathDto: CreateCustomPlatformRequestPathDto,
		@Body(CreateCustomPlatformRequestBodyDto) createCustomPlatformRequestBodyDto: CreateCustomPlatformRequestBodyDto,
	): Promise<{ customPlatformProfile: CustomPlatformEntity }> {
		await this.authorization.can(userEntity, [Permission.CreateCustomPlatform]);

		return { customPlatformProfile: await this.customPlatformService.createCustomPlatform(createCustomPlatformRequestPathDto, createCustomPlatformRequestBodyDto) };
	}

	public async updateCustomPlatform(
		@Auth userEntity: UserEntity,
		@Path("customPlatformUuid") customPlatformUuid: string,
		@Body(UpdateCustomPlatformRequestDto) updateCustomPlatformRequestDto: UpdateCustomPlatformRequestDto,
	): Promise<{ customPlatform: CustomPlatformEntity }> {
		await this.authorization.can(userEntity, [Permission.UpdateCustomPlatform]);

		return { customPlatform: await this.customPlatformService.updateCustomPlatform(customPlatformUuid, updateCustomPlatformRequestDto) };
	}

	public async deleteCustomPlatform(@Auth authEntity: UserEntity, @Path("customPlatformUuid") customPlatformUuid: string): Promise<{ customPlatformEntity: boolean }> {
		await this.authorization.can(authEntity, [Permission.DeleteCustomPlatform]);

		return { customPlatformEntity: await this.customPlatformService.deleteCustomPlatform(customPlatformUuid) };
	}
}
