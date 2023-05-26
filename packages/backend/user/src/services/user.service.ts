import { Service } from "typedi";

@Service()
export class UserService {
	public getUserList(): void {
		console.log("getUserList");
	}

	public getUser(): void {
		console.log("getUser");
	}

	public deleteUser(): void {
		console.log("deleteUser");
	}
}
