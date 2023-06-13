import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class NotFoundException extends Exception {
	public constructor(message: string) {
		super(message, 404);
	}
}
