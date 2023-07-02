import { BadRequestException } from "@/backend-core/request-processor/exceptions";

export class PasswordMissingException extends BadRequestException {
	public constructor() {
		super("Use social login to log in the application");
	}
}
