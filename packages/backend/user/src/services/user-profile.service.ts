import { Inject } from "iocc";
import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";

export class UserProfileService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
	) {}

	public getUserProfiles(userProfileUserId: number, userActiveUserProfileId: number): Promise<Array<UserProfileEntity>> {
		return this.userProfileRepository.getUserProfiles(userProfileUserId, userActiveUserProfileId);
	}
}
