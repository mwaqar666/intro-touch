import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";

export class InvalidTokenException extends UnauthorizedException {
	public constructor() {
		super("Invalid token");
	}
}
