import type { IRequest } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";

export class UserService {
	public async getUserList(request: IRequest, context: Context): Promise<void> {
		console.log("UserService => getUserList", "Request: ", request, "Context: ", context);
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
