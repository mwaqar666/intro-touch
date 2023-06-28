import type { IControllerRequest } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserRepository } from "@/backend/user/db/repositories";

export class UserService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
	) {}

	public async getUserList(request: IControllerRequest, context: Context): Promise<Array<UserEntity>> {
		console.log("UserService => getUserList", "Request: ", request, "Context: ", context);

		return await this.userRepository.findAll({
			findOptions: {},
		});
	}

	public async getUser(request: IControllerRequest, context: Context): Promise<void> {
		console.log("UserService => getUser", "Request: ", request, "Context: ", context);
	}

	public async createUser(request: IControllerRequest, context: Context): Promise<void> {
		console.log("UserService => createUser", "Request: ", request, "Context: ", context);
	}

	public async updateUser(request: IControllerRequest, context: Context): Promise<void> {
		console.log("UserService => updateUser", "Request: ", request, "Context: ", context);
	}

	public async deleteUser(request: IControllerRequest, context: Context): Promise<void> {
		console.log("UserService => deleteUser", "Request: ", request, "Context: ", context);
	}
}
