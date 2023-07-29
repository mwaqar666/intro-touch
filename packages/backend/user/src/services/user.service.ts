import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository } from "@/backend/user/db/repositories";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
	) {}

	public async getAuthUserWithLiveProfile(authEntity: UserEntity): Promise<UserEntity> {
		const userLiveProfile: UserProfileEntity = await this.userProfileRepository.getAuthUserLiveProfile(authEntity);

		authEntity.setDataValue("userLiveUserProfile", userLiveProfile);

		return authEntity;
	}
}
