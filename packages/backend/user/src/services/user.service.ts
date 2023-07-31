import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
	) {}

	public async getAuthUserWithLiveProfile(authEntity: UserEntity): Promise<UserEntity> {
		const userLiveProfile: UserProfileEntity = await this.userProfileRepository.getAuthUserLiveProfile(authEntity);

		authEntity.setDataValue("userLiveUserProfile", userLiveProfile);

		return authEntity;
	}

	public async getUserPublicPreviewWithLiveProfile(userUsername: string): Promise<UserEntity> {
		const user: UserEntity = await this.userRepository.findOrFailActiveUserByUsername(userUsername);

		const userLiveProfile: UserProfileEntity = await this.userProfileRepository.getAuthUserLiveProfile(user);

		user.setDataValue("userLiveUserProfile", userLiveProfile);

		return user;
	}
}
