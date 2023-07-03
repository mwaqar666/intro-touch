import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";

export class InvalidCredentialsException extends UnauthorizedException {
	public constructor() {
		super("Invalid Credentials!");
	}
}
