import type { IControllerRequest } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";

export class UserService {
	public async getUserList(request: IControllerRequest, context: Context): Promise<void> {
		console.log("UserService => getUserList", "Request: ", request, "Context: ", context);
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
