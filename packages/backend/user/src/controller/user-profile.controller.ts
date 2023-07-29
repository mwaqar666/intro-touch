import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { PermissionsEnum } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
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

		return { userProfiles: await this.userProfileService.getUserProfiles(authEntity.userId, authEntity.userActiveUserProfileId) };
	}
}
