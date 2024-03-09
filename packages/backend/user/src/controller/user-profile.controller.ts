import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { CreateUserProfileRequestDto } from "@/backend/user/dto/create-user-profile";
import { UpdateUserProfileRequestDto } from "@/backend/user/dto/update-user-profile";
import { UserProfileService } from "@/backend/user/services";

@Controller
export class UserProfileController {
	public constructor(
		// Dependencies
		@Inject(UserProfileService) private readonly userProfileService: UserProfileService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async getAuthUserProfileDropdown(@Auth authEntity: UserEntity): Promise<{ userProfiles: Array<UserProfileEntity> }> {
		await this.authorization.can(authEntity, [PermissionsEnum.ListUserProfile]);

		return { userProfiles: await this.userProfileService.getAuthUserProfileDropdown(authEntity) };
	}

	public async getUserProfile(@Auth authEntity: UserEntity, @Path("userProfileUuid") userProfileUuid: string): Promise<{ userProfile: UserProfileEntity }> {
		await this.authorization.can(authEntity, [PermissionsEnum.ViewUserProfile]);

		return { userProfile: await this.userProfileService.getUserProfile(userProfileUuid) };
	}

	public async createUserProfile(@Auth authEntity: UserEntity, @Body(CreateUserProfileRequestDto) createUserProfileRequestDto: CreateUserProfileRequestDto): Promise<{ userProfile: UserProfileEntity }> {
		await this.authorization.can(authEntity, [PermissionsEnum.CreateUserProfile]);

		return { userProfile: await this.userProfileService.createUserProfile(authEntity, createUserProfileRequestDto) };
	}

	public async updateUserProfile(
		@Auth authEntity: UserEntity,
		@Path("userProfileUuid") userProfileUuid: string,
		@Body(UpdateUserProfileRequestDto) updateUserProfileRequestDto: UpdateUserProfileRequestDto,
	): Promise<{ userProfile: UserProfileEntity }> {
		await this.authorization.can(authEntity, [PermissionsEnum.UpdateUserProfile]);

		return { userProfile: await this.userProfileService.updateUserProfile(userProfileUuid, updateUserProfileRequestDto) };
	}
}
