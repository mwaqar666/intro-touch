import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserRepository } from "@/backend/user/db/repositories";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
	) {}

	public async getUserList(user: UserEntity): Promise<Array<UserEntity>> {
		console.log("UserService => getUserList", "Auth User: ", user);

		return await this.userRepository.findAll({
			findOptions: {},
		});
	}

	public async getUser(user: UserEntity): Promise<void> {
		console.log("UserService => getUser", "Auth User: ", user);
	}

	public async createUser(user: UserEntity): Promise<void> {
		console.log("UserService => createUser", "Auth User: ", user);
	}

	public async updateUser(user: UserEntity): Promise<void> {
		console.log("UserService => updateUser", "Auth User: ", user);
	}

	public async deleteUser(user: UserEntity): Promise<void> {
		console.log("UserService => deleteUser", "Auth User: ", user);
	}
}
