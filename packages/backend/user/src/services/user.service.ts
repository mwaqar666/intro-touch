import type { IRequest } from "@/backend-core/request-processor/types";
import type { Context } from "aws-lambda";

export class UserService {
	public getUserList(request: IRequest, context: Context): void {
		console.log("UserService => getUserList", "Request: ", request, "Context: ", context);
	}

	public getUser(request: IRequest, context: Context): void {
		console.log("UserService => getUser", "Request: ", request, "Context: ", context);
	}

	public deleteUser(request: IRequest, context: Context): void {
		console.log("UserService => deleteUser", "Request: ", request, "Context: ", context);
	}
}
