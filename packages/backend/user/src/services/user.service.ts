import type { IRequest } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { UserTokenConst } from "@/backend/user/const";
import type { UserRepository } from "@/backend/user/repository";

export class UserService {
	public constructor(
		// Dependencies
		@Inject(UserTokenConst.UserRepositoryToken) private readonly userRepository: UserRepository,
	) {}

	public async getUserList(request: IRequest, context: Context): Promise<void> {
		console.log("UserService => getUserList", "Request: ", request, "Context: ", context);
		await this.userRepository.findAll("waqar");
	}

	public async getUser(request: IRequest, context: Context): Promise<void> {
		console.log("UserService => getUser", "Request: ", request, "Context: ", context);
	}

	public async createUser(request: IRequest, context: Context): Promise<void> {
		console.log("UserService => getUser", "Request: ", request, "Context: ", context);
	}

	public async updateUser(request: IRequest, context: Context): Promise<void> {
		console.log("UserService => getUser", "Request: ", request, "Context: ", context);
	}

	public async deleteUser(request: IRequest, context: Context): Promise<void> {
		console.log("UserService => deleteUser", "Request: ", request, "Context: ", context);
	}
}
