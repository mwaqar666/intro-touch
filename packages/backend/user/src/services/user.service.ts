import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
	) {}

	public async getUserWithLiveProfile(userEntity: string): Promise<UserEntity>;
	public async getUserWithLiveProfile(userEntity: UserEntity): Promise<UserEntity>;
	public async getUserWithLiveProfile(userEntity: string | UserEntity): Promise<UserEntity> {
		if (typeof userEntity === "string") {
			userEntity = await this.userRepository.findOrFailActiveUserByUsername(userEntity);
		}

		const userLiveProfile: UserProfileEntity = await this.userProfileRepository.getUserLiveProfile(userEntity);

		userEntity.setDataValue("userLiveUserProfile", userLiveProfile);

		return userEntity;
	}
}
