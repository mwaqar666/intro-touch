import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { CreatePlatformProfileRequestBodyDto, CreatePlatformProfileRequestPathDto } from "@/backend/platform/dto/create-platform-profile";
import { UpdatePlatformProfileRequestDto } from "@/backend/platform/dto/update-platform-profile";
import type { UserOwnedPlatformResponseDto } from "@/backend/platform/dto/user-owned";
import { UserOwnedPlatformRequestDto } from "@/backend/platform/dto/user-owned";
import { PlatformProfileService } from "@/backend/platform/services";

@Controller
export class PlatformProfileController {
	public constructor(
		// Dependencies
		@Inject(PlatformProfileService) private readonly platformProfileService: PlatformProfileService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public getUserOwnedPlatforms(@Path(UserOwnedPlatformRequestDto) userOwnedPlatformRequestDto: UserOwnedPlatformRequestDto): Promise<UserOwnedPlatformResponseDto> {
		return this.platformProfileService.getUserOwnedPlatforms(userOwnedPlatformRequestDto);
	}

	public async createPlatformProfile(
		@Auth userEntity: UserEntity,
		@Path(CreatePlatformProfileRequestPathDto) createPlatformProfileRequestPathDto: CreatePlatformProfileRequestPathDto,
		@Body(CreatePlatformProfileRequestBodyDto) createPlatformProfileRequestBodyDto: CreatePlatformProfileRequestBodyDto,
	): Promise<{ platformProfile: PlatformProfileEntity }> {
		await this.authorization.can(userEntity, [Permission.CreatePlatformProfile]);

		return { platformProfile: await this.platformProfileService.createPlatformProfile(createPlatformProfileRequestPathDto, createPlatformProfileRequestBodyDto) };
	}

	public async updatePlatformProfile(
		@Auth userEntity: UserEntity,
		@Path("platformProfileUuid") platformProfileUuid: string,
		@Body(UpdatePlatformProfileRequestDto) updatePlatformProfileRequestDto: UpdatePlatformProfileRequestDto,
	): Promise<{ platformProfile: PlatformProfileEntity }> {
		await this.authorization.can(userEntity, [Permission.UpdatePlatformProfile]);

		return { platformProfile: await this.platformProfileService.updatePlatformProfile(platformProfileUuid, updatePlatformProfileRequestDto) };
	}

	public async deletePlatformProfile(@Auth userEntity: UserEntity, @Path("platformProfileUuid") platformProfileUuid: string): Promise<{ platformProfile: boolean }> {
		await this.authorization.can(userEntity, [Permission.DeletePlatformProfile]);

		return { platformProfile: await this.platformProfileService.deletePlatformProfile(platformProfileUuid) };
	}
}
