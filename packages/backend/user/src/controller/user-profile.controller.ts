import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";
import { UserProfileService } from "@/backend/user/services";

@Controller
export class UserProfileController {
	public constructor(
		// Dependencies
		@Inject(UserProfileService) private readonly userProfileService: UserProfileService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getUserProfiles(@Auth authEntity: UserEntity): Promise<{ userProfiles: Array<UserProfileEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.LIST_USER_PROFILE]);

		return { userProfiles: await this.userProfileService.getUserProfiles(authEntity.userId) };
	}

	public async getUserProfile(@Auth authEntity: UserEntity, @Path("userProfileUuid") userProfileUuid: string): Promise<{ userProfile: UserProfileEntity }> {
		await this.authorization.can(authEntity, [PermissionsEnum.VIEW_USER_PROFILE]);

		return { userProfile: await this.userProfileService.getUserProfile(userProfileUuid) };
	}

	public async updateUserProfile(
		@Auth authEntity: UserEntity,
		@Path("userProfileUuid") userProfileUuid: string,
		@Body(UpdateUserProfileRequestDto) updateUserProfileRequestDto: UpdateUserProfileRequestDto,
	): Promise<{ userProfile: UserProfileEntity }> {
		await this.authorization.can(authEntity, [PermissionsEnum.UPDATE_USER_PROFILE]);

		return { userProfile: await this.userProfileService.updateUserProfile(userProfileUuid, updateUserProfileRequestDto) };
	}
}
