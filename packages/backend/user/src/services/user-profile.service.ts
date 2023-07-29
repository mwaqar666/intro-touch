import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";

export class UserProfileService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
	) {}

	public getAuthUserProfileDropdown(authEntity: UserEntity): Promise<Array<UserProfileEntity>> {
		return this.userProfileRepository.getAuthUserProfileDropdown(authEntity);
	}
}
